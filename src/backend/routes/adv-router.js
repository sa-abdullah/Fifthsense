import express from 'express';
import { cachedStocks } from './router.js';
import { AIAdvisorChain } from '../chains/advisor-chain.js';
import verifyToken  from '../firebase-admin.js';
import { fetchAllStocks } from './router.js'


const router = express.Router()

router.post('/ask', verifyToken, async (req, res) => {
    try {
        const { question, profile } = req.body;
        const user = req.user;

        if (!question) return res.status(400).json({ error: 'Question is required' });
        if (!user) return res.status(401).json({ error: 'Unauthorized user' });

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

        const stream = await chain.stream({ input: userPrompt });

        let fullText = '';

        (async () => {
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
            res.end();
        })();
    } catch (err) {
        console.error('Advisor error:', err);
        res.status(500).json({ success: false, error: 'Failed to process question' });
    }
});

export default router;
