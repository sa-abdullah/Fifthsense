import express from 'express';
import axios from 'axios';

const router = express.Router();

const BASE_URL = 'https://stocks-data-llv3.onrender.com/api/stocks';

let cachedStocks = [];
let lastFetched = 0;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// ✅ Fetch from your Render API
const fetchAllStocks = async () => {
    console.log('Fetching stocks from stocks API...');
    try {
        const response = await axios.get(BASE_URL);
        cachedStocks = response?.data?.data || []; // Assuming API returns an array of stocks
        lastFetched = Date.now();
        console.log(`✅ Cached ${cachedStocks.length} stocks`);
        return cachedStocks;
    } catch (err) {
        console.error('Error fetching stocks:', err.message);
        return [];
    }
};

// ✅ Route to get stocks (with pagination)
router.get('/all', async (req, res) => {
    const now = Date.now();
    if (!cachedStocks.length || now - lastFetched > CACHE_DURATION) {
        await fetchAllStocks();
    }

    const { page = 1, limit = 50 } = req.query;
    const start = (page - 1) * limit;
    const paginated = cachedStocks.slice(start, start + Number(limit));

    res.json({
        total: cachedStocks.length,
        page: Number(page),
        limit: Number(limit),
        results: paginated
    });
});

// ✅ Auto-refresh cache every 10 mins
(async function initCache() {
    console.log('Initializing stock cache...');
    await fetchAllStocks();
    setInterval(fetchAllStocks, CACHE_DURATION);
})();

export { cachedStocks, fetchAllStocks };
export default router;
