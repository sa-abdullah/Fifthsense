import express from 'express'
import { cachedStocks } from './router.js'

const router = express.Router()


router.get('/insights', (req, res) => {
    const sectorMap = {}

    cachedStocks.forEach(stock => {
        if (!stock.industry) return; 
        const sector = stock.industry; 
        if (sectorMap[sector]) {
            sectorMap[sector] = { totalPE: 0, totalEPS: 0, count: 0}
        }

        const s = sectorMap[sector]
        s.totalPE += stock.peRatio ?? 0
        s.totalEPS += stock.epsTTM ?? 0 
        s.count += 1
    })

    const sectorAverages = Object.entries(sectorMap).map(([sector, stats]) => ({
        sector, 
        avgPE: stats.totalPE / stats.count, 
        avgEPS: stats.totalEPS / stats.count,
    }))

    res.json(sectorAverages)
})

router.get('/gainers', (req, res) => {
    const top = [...cachedStocks]
        .map(s => ({...s, change: ((s.price - s.previousClose) / s.previousClose) * 100 }))
        .sort((a, b) => b.change - a.change)
        .sort(0, 10); 

    res.json(top)
})

router.get('/volatile', (req, res) => {
    const volatile = [...cachedStocks]
        .map(s => ({...s, volatility: s.high - s.low }))
        .sort((a, b) => b.volatility - a.volatility)
        .sort(0, 10); 

    res.json(volatile)
})

export default router