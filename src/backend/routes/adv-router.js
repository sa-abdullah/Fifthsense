import express from 'express';
import { cachedStocks } from './router.js';
import { AIAdvisorChain, vectorStore, getOrCreateMemory } from '../chains/advisor-chain.js';
import verifyToken  from '../firebase-admin.js';
import { Chat, Session } from '../data-model.js';
// import { fetchAllStocks } from './router.js'


const router = express.Router()

router.post('/ask', verifyToken, async (req, res) => {
    const { question, profile } = req.body;
    const user = req.user;
    if (!question) return res.status(400).json({ error: 'Question is required' });
    if (!user) return res.status(401).json({ error: 'Unauthorized user' });


    try {
        const memory = getOrCreateMemory(user.uid)


        const input = {
            question,
            userProfile: { ...profile, uid: user.uid, email: user.email },
            marketData: cachedStocks // consider enriching with livePrices
        };
        console.log('Length of cached stocks:', cachedStocks.length)

        const { chain, userPrompt } = await AIAdvisorChain.invoke(input);

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('Transfer-Encoding', 'chunked');
        res.flushHeaders();

        const memoryVars = await memory.loadMemoryVariables({ input: userPrompt });
        const stream = await chain.stream({ input: userPrompt, ...memoryVars });

        let fullText = '';

        try {
            for await (const chunk of stream) {
                const token = chunk?.content || '';
                if (token) {
                    fullText += token;
                    // ✅ Stream token immediately to frontend
                    res.write(`data: ${token}\n\n`);
                }
            }

            let suggestions = [];
            let analysis = null;
            let mainContent = fullText;

            // ✅ Try to extract JSON if present
            try {
                const jsonMatch = fullText.match(/\{[\s\S]*\}$/); // only last JSON block
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

            try {
                let session = await Session.findOne({ userId: user.uid }).sort({ createdAt: -1 })
                if (!session) session = await Session.create({ userId: user.uid})

                const saveOps = [
                    //Saves session for short-term context
                    memory.saveContext({ input: question }, { output: mainContent }),

                    //Saves session for longer-term context
                    vectorStore.addDocuments([{
                            pageContent: `${question} ${mainContent}`,
                            metadata: { userId: user.uid, timestamp: new Date().toISOString() }
                    }]).catch(err => console.error("Pinecone save failed:", err)), 

                    //Saves session on MongoDB for UI Rendering
                    Chat.create({ sessionId: session._id, role: 'user', content: question }),
                    Chat.create({ sessionId: session._id, role: 'ai', content: mainContent })
                ]
                await Promise.all(saveOps);
            } catch(saveErr) {
                console.error('Save operation failed:', saveErr)
            } 

        } catch(streamErr) {
            console.error('Streaming error:', streamErr);
            res.write(`data: ${JSON.stringify({ done: true, error: "Streaming failed" })}\n\n`);
        } finally {
                res.end();
        }

    } catch (err) {
        console.error('Advisor Streaming error:', err);
        res.write(`data: ${JSON.stringify({ done: true, error: "Streaming failed" })}\n\n`);
    } 
});


export default router;
