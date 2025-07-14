import express from 'express';
import { cachedStocks } from './router.js';
import { AIAdvisorChain } from '../chains/advisor-chain.js';
import { verifyToken } from '../auth.js'


const router = express.Router()
// =====================
// GET /api/advisor/context
// Preprocessed insights for quick answers
// =====================

//START HERE
// router.get('/context', (req, res) => {
//     const now = new Date();

//   // 🔹 Top 5 Gainers
//     const topGainers = [...cachedStocks]
//         .map(s => ({
//             ...s, 
//             change: ((s.price - s.previousClose) / s.previousClose) * 100
//         }))
//         .filter(s => !isNaN(s.change))
//         .sort((a, b) => b.change - a.change)
//         .slice(0, 5)
//         .map(s => ({
//             symbol: s.symbol, 
//             name: s.name, 
//             price: s.price, 
//             change: Number(s.change.toFixed(2))
//         }));

//   // 🔹 Top 5 Volatile Stocks

//     const mostVolatile = [...cachedStocks]
//         .map(s => ({
//             ...s, 
//             volatility: s.high - s.low
//         }))
//         .filter(s => !isNaN(s.volatility))
//         .sort((a, b) => b.volatility - a.volatility)
//         .slice(0, 5)
//         .map(s => ({
//             symbol: s.symbol, 
//             name: s.name, 
//             volatility: Number(s.volatility.toFixed(2))
//         }))

//   // 🔹 Sector Performance (avg PE and EPS)
//     const sectorMap = {};
//     cachedStocks.forEach(stock => {
//         if (!stock.industry) return;
//         const sector = stock.industry;
//         if (!sectorMap[sector]) {
//             sectorMap[sector] = { totalPE: 0, totalEPS: 0, count: 0 };
//         }

//         const entry = sectorMap[sector];
//         entry.totalPE += stock.peRatio ?? 0;
//         entry.totalEPS += stock.epsTTM ?? 0;
//         entry.count++;
//     });

//     const sectorPerformance = Object.entries(sectorMap).reduce((acc, [sector, stats]) => {
//         acc[sector] = {
//           avgPE: Number((stats.totalPE / stats.count).toFixed(2)),
//           avgEPS: Number((stats.totalEPS / stats.count).toFixed(2))
//         };
//         return acc;
//     }, {});

//   // 🔹 Basic Recommendations (Top by earnings * price heuristic)
//     const recommendations = cachedStocks
//         .filter(s => s.peRatio && s.epsTTM)
//         .sort((a, b) => (b.epsTTM * b.price) - (a.epsTTM * a.price)) // crude signal
//         .slice(0, 5)
//         .map(s => ({
//             symbol: s.symbol,
//             name: s.name,
//             sector: s.industry,
//             price: s.price,
//             peRatio: s.peRatio,
//             eps: s.epsTTM
//         }));

//     // 🔹 News Summary (Placeholder)
//     const newsSummary = "Today, the tech sector rallied after lower-than-expected inflation data. Energy stocks declined amid falling oil prices.";

//     // 🔹 Economic Indicators (Placeholder)
//     const economicIndicators = {
//         CPI: 3.1,
//         unemploymentRate: 4.2,
//         interestRate: 5.25
//     };

//   // 🔹 Final Advisor Context JSON
//     res.json({
//         timestamp: now.toISOString(),
//         marketSummary: {
//             topGainers,
//             mostVolatile,
//             sectorPerformance,
//             recommendations
//         },
//         newsSummary,
//         economicIndicators,
//         notes: `Based on ${cachedStocks.length} stocks. Generated at ${now.toLocaleString()}.`
//     });
// });

// END HERE



// =====================
// GET /api/advisor/full
// Raw data for full Langchain flexibility
// =====================
router.get('/full', (req, res) => {

    if (!cachedStocks || cachedStocks.length === 0) {
        return res.status(503).json({ error: 'Market data not available' })
    }
    const rawData = cachedStocks.map(s => ({
        symbol: s.symbol,
        name: s.name,
        sector: s.industry,
        price: s.price,
        high: s.high,
        low: s.low,
        previousClose: s.previousClose,
        peRatio: s.peRatio,
        eps: s.epsTTM,
        marketCap: s.marketCap
    }));

    res.json({
        timestamp: new Date().toISOString(),
        count: rawData.length,
        stocks: rawData
    });
});

router.post('/ask', verifyToken, async (req, res) => {
    try {
        const { question, profile } = req.body; 
        const user = req.user; 

        if (!question) {
            return res.status(400).json({ error: 'Question is required'})
        }

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized user' });
        }

        const input = {
            question,
            userProfile: {
                ...profile, 
                uid: user.uid, 
                email: user.email,
            },
            marketData: cachedStocks
        }

        const answer = await AIAdvisorChain.invoke(input);

        if (!answer) {
            return res.status(500).json({
                success: false,
                error: 'No response from AI advisor'
            });
        }
        
        res.json({ success: true, answer})

    } catch (err) {
        console.error('Advisor error:', err);
        res.status(500).json({ success: false, error: 'Failed to process question' });
    }
})

export default router;
