import express from 'express'
import axios from 'axios'


const router = express.Router()

const FINNHUB_STOCKS_API_KEY = process.env.FINNHUB_STOCKS_API_KEY
const BASE_API = 'https://finnhub.io/api/v1/'

let cachedStocks = []
let lastFetched = 0
const CACHE_DURATION = 1000 * 60 * 10 



const fetchAllStocks = async () => {
    const symbolRes = await axios.get(`${BASE_API}/stock/symbol?exchange=US&token=${FINNHUB_STOCKS_API_KEY}`); 
    const symbols = symbolRes.data.filter(s => s.type == 'Common Stock').slice(0, 100);

    const enriched = await Promise.all(symbols.map(async (s) => {
        try {
            const [quote, profile] = await Promise.all([
                axios.get(`${BASE_API}/quote?symbol=${s.symbol}&token=${FINNHUB_STOCKS_API_KEY}`),
                axios.get(`${BASE_API}/stock/profile2?symbol=${s.symbol}&token=${FINNHUB_STOCKS_API_KEY}`)
            ]); 

            return {
                symbol: s.symbol,
                name: profile.data.name || s.description, 
                industry: profile.data.finnhubIndustry || 'N/A', 
                logo: profile.data.logo || null, 
                price: quote.data.c, 
                high: quote.data.h, 
                low: quote.data.l, 
                previousClose: quote.data.pc,
                peRatio: profile.data.peBasicExclExtraTTM || null, 
                epsTTM: profile.data.epsTTM || null, 
                marketCap: profile.data.marketCapitalization || null
            }
        } catch(err) {
            return null
        }
    })); 

    return enriched.filter(Boolean)
}


router.get('/all', async(req, res) => {
    const now = Date.now();

    const { industry, page = 1, limit = 10} = req.query;

    if (!cachedStocks.length || now - lastFetched > CACHE_DURATION) {
        try {
            cachedStocks = await fetchAllStocks();
            lastFetched = now; 
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch stock list', details: err.message })
        }
    }

    let results = [...cachedStocks]

    if (industry) {
        results = results.filter(s => 
            s.industry.toLowerCase().includes(industry.toLowerCase())
        );
    }
    const start = (page - 1) * limit
    const paginated = results.slice(start, start + Number(limit))

    res.json({
        total: results.length, 
        page: Number(page),
        limit: Number(limit), 
        results: paginated
    })
    // res.json(cachedStocks);
})
export { cachedStocks }
export default router;
