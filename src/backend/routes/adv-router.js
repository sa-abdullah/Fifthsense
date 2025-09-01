import express from 'express';
import { cachedStocks } from './router.js';
import { AIAdvisorChain, getOrCreateMemory } from '../chains/advisor-chain.js';
import verifyToken from '../firebase-admin.js';
import { Chat, Session } from '../data-model.js';

const router = express.Router();

// 📌 Create a new chat session
router.post('/session', verifyToken, async (req, res) => {
  try {
    const { title } = req.body;
    const session = await Session.create({
      userId: req.user.uid,
      title: title || 'New Chat'
    });
    res.json({ sessionId: session._id });
  } catch (err) {
    console.error('Error creating session:', err);
    res.status(500).json({ error: 'Failed to create session' });
  }
});


router.post('/ask', verifyToken, async (req, res) => {
  const { question, profile, sessionId } = req.body;
  const user = req.user;
  if (!question) return res.status(400).json({ error: 'Question is required' });
  if (!user) return res.status(401).json({ error: 'Unauthorized user' });

  try {
    // Find or create session
    let session = null;
    if (sessionId) {
      session = await Session.findById(sessionId);
    }
    if (!session) {
      session = await Session.create({ userId: user.uid });
    }

    const { bufferMemory, vectorStore, hasVectorMemory } = await getOrCreateMemory(user.uid);

    const input = {
      question,
      userProfile: { ...profile, uid: user.uid, email: user.email },
      marketData: cachedStocks,
      hasVectorMemory,
      vectorStore
    };

    const { chain, userPrompt } = await AIAdvisorChain.invoke(input);

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    // Load previous buffer memory
    let memoryVars = { history: [] };
    try {
      const loadedVars = await bufferMemory.loadMemoryVariables({ input: userPrompt });
      if (loadedVars && Array.isArray(loadedVars.history)) {
        memoryVars.history = loadedVars.history;
      }
    } catch (err) {
      console.error('❌ Memory loading failed:', err.message);
    }

    const stream = await chain.stream({ input: userPrompt, ...memoryVars });

    let fullText = '';
    try {
      for await (const chunk of stream) {
        const token = chunk?.content || '';
        if (token) {
          fullText += token;
          res.write(`data: ${token}\n\n`);
        }
      }

      let suggestions = [];
      let analysis = null;
      let mainContent = fullText;

      try {
        const jsonMatch = fullText.match(/\{[\s\S]*\}$/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          mainContent = parsed.content || mainContent;
          suggestions = parsed.suggestions || [];
          analysis = parsed.analysis || null;
        }
      } catch (err) {
        console.warn('Failed to parse AI JSON:', err.message);
      }

      res.write(`data: ${JSON.stringify({ done: true, content: mainContent, suggestions, analysis })}\n\n`);

      // Save chat + update session
      await handleSaveOperations({
        bufferMemory,
        vectorStore,
        hasVectorMemory,
        user,
        question,
        mainContent,
        session
      });

    } catch (err) {
      console.error('❌ Streaming error:', err);
      res.write(`data: ${JSON.stringify({ done: true, error: "Streaming failed" })}\n\n`);
    } finally {
      res.end();
    }

  } catch (err) {
    console.error('❌ Advisor error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.write(`data: ${JSON.stringify({ done: true, error: "Streaming failed" })}\n\n`);
      res.end();
    }
  }
});

// Save operations
async function handleSaveOperations({ bufferMemory, vectorStore, hasVectorMemory, user, question, mainContent, session }) {
  // Save to buffer
  try {
    await bufferMemory.saveContext({ input: question }, { output: mainContent });
    console.log('✅ Buffer memory saved');
  } catch (err) {
    console.error('❌ Buffer save failed:', err.message);
  }

  // Save to vector
  if (vectorStore && hasVectorMemory) {
    try {
      await vectorStore.addDocuments([{
        pageContent: `Q: ${question}\nA: ${mainContent}`,
        metadata: { userId: user.uid, timestamp: new Date().toISOString(), type: 'conversation' }
      }]);
      console.log('✅ Vector store saved');
    } catch (err) {
      console.error('❌ Vector store save failed:', err.message);
    }
  }

  // Save to Mongo
  try {
    await Promise.all([
      Chat.create({ sessionId: session._id, role: 'user', content: question }),
      Chat.create({ sessionId: session._id, role: 'ai', content: mainContent })
    ]);
    session.updatedAt = new Date();
    await session.save();
    console.log('✅ MongoDB chats saved');
  } catch (err) {
    console.error('❌ MongoDB save failed:', err.message);
  }
}

// 📌 Get last 10 sessions
router.get('/history', verifyToken, async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.user.uid })
      .sort({ updatedAt: -1 })
      .limit(10)
      .lean();

    const history = await Promise.all(sessions.map(async (session) => {
      const messages = await Chat.find({ sessionId: session._id })
        .sort({ timestamp: 1 })
        .lean();
      return {
        id: session._id,
        title: session.title || messages[0]?.content?.slice(0, 50) || "New Chat",
        preview: messages.find(m => m.role === 'ai')?.content?.slice(0, 80) || "",
        timestamp: session.updatedAt,
        messageCount: messages.length
      };
    }));

    res.json(history);
  } catch (err) {
    console.error('Error fetching history:', err);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// 📌 Get messages for session
router.get('/history/:sessionId', verifyToken, async (req, res) => {
  try {
    const messages = await Chat.find({ sessionId: req.params.sessionId })
      .sort({ timestamp: 1 })
      .lean();
    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Failed to fetch session messages' });
  }
});

export default router;
