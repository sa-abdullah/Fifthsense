import express from 'express';
import { cachedStocks } from './router.js';
import { AIAdvisorChain, getOrCreateMemory } from '../chains/advisor-chain.js';
import verifyToken  from '../firebase-admin.js';
import { Chat, Session } from '../data-model.js';
import { BufferWindowMemory } from "langchain/memory";

const router = express.Router()

router.post('/ask', verifyToken, async (req, res) => {
    const { question, profile } = req.body;
    const user = req.user;
    if (!question) return res.status(400).json({ error: 'Question is required' });
    if (!user) return res.status(401).json({ error: 'Unauthorized user' });

    try {
        const { bufferMemory, vectorStore, hasVectorMemory } = await getOrCreateMemory(user.uid)

        const input = {
            question,
            userProfile: { ...profile, uid: user.uid, email: user.email },
            marketData: cachedStocks,
            hasVectorMemory,
            vectorStore // Pass vectorStore to the chain
        };

        const { chain, userPrompt } = await AIAdvisorChain.invoke(input);

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('Transfer-Encoding', 'chunked');
        res.flushHeaders();

        // ✅ Simple memory loading - only buffer memory
        let memoryVars = { history: [] };
        try {
            const loadedVars = await bufferMemory.loadMemoryVariables({ input: userPrompt });
            if (loadedVars && Array.isArray(loadedVars.history)) {
                memoryVars.history = loadedVars.history;
            }
            console.log('✅ Buffer memory loaded successfully:', memoryVars.history.length, 'messages');
        } catch (memoryError) {
            console.error('❌ Memory loading failed:', memoryError.message);
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

            // ✅ Try to extract JSON if present
            try {
                const jsonMatch = fullText.match(/\{[\s\S]*\}$/);
                if (jsonMatch) {
                    const parsed = JSON.parse(jsonMatch[0]);
                    mainContent = parsed.content || mainContent;
                    suggestions = parsed.suggestions || [];
                    analysis = parsed.analysis || null;
                }
            } catch (err) {
                console.warn('Failed to parse AI JSON response:', err.message);
            }

            // ✅ Final structured event
            res.write(`data: ${JSON.stringify({ done: true, content: mainContent, suggestions, analysis })}\n\n`);

            // ✅ Save operations
            await handleSaveOperations({
                bufferMemory,
                vectorStore,
                hasVectorMemory,
                user,
                question,
                mainContent
            });

        } catch(streamErr) {
            console.error('❌ Streaming error:', streamErr);
            res.write(`data: ${JSON.stringify({ done: true, error: "Streaming failed" })}\n\n`);
        } finally {
            res.end();
        }

    } catch (err) {
        console.error('❌ Advisor Streaming error:', err);
        if (!res.headersSent) {
            res.status(500).json({ error: "Internal server error" });
        } else {
            res.write(`data: ${JSON.stringify({ done: true, error: "Streaming failed" })}\n\n`);
            res.end();
        }
    } 
});

// ✅ Simplified save operations
async function handleSaveOperations({ bufferMemory, vectorStore, hasVectorMemory, user, question, mainContent }) {
    const saveResults = {
        bufferMemory: false,
        vectorStore: false,
        mongodb: false
    };

    // 1. Save to buffer memory (this should always work now)
    try {
        await bufferMemory.saveContext({ input: question }, { output: mainContent });
        saveResults.bufferMemory = true;
        console.log('✅ Buffer memory saved successfully');
    } catch (memoryError) {
        console.error('❌ Buffer memory save failed:', memoryError.message);
    }

    // 2. Save to vector store (for long-term memory retrieval)
    if (vectorStore && hasVectorMemory) {
        try {
            await vectorStore.addDocuments([{
                pageContent: `Q: ${question}\nA: ${mainContent}`,
                metadata: { 
                    userId: user.uid, 
                    timestamp: new Date().toISOString(),
                    type: 'conversation'
                }
            }]);
            saveResults.vectorStore = true;
            console.log('✅ Vector store document saved');
        } catch (vectorSaveError) {
            console.error('❌ Vector store save failed:', vectorSaveError.message);
        }
    }

    // 3. Save to MongoDB (for UI display)
    try {
        let session = await Session.findOne({ userId: user.uid }).sort({ createdAt: -1 });
        if (!session) {
            session = await Session.create({ userId: user.uid });
        }

        await Promise.all([
            Chat.create({ sessionId: session._id, role: 'user', content: question }),
            Chat.create({ sessionId: session._id, role: 'ai', content: mainContent })
        ]);
        
        saveResults.mongodb = true;
        console.log('✅ MongoDB chats saved successfully');
    } catch (mongoError) {
        console.error('❌ MongoDB save failed:', mongoError.message);
    }

    const successCount = Object.values(saveResults).filter(Boolean).length;
    console.log(`📊 Save operations summary: ${successCount}/3 successful`, saveResults);
    return saveResults;
}

export default router;