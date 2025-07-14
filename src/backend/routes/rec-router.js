import express from 'express'
import { cachedStocks } from './router.js'

const router = express.Router()

router.get('/', (req, res) => {
    const { industry = 'peRatio', order = 'asc', limit = 10 } = req.query;
    let data = [...cachedStocks]; 

    if (industry) {
        data = data.filter(s => s.industry.toLowerCase().include(s.industry.toLowerCase())); 
    }

    data = data.sort((a, b) => {
        const valA = a[sort] ?? 0
        const valB = b[sort] ?? 0
        return order === 'desc' ? valB - valA : valA - valB
    })

    res.json(data.slice(0, limit))
})

export default router