import axios from axios 

export const getStocksData = async (symbol) => {
    const endOfDayAPIKey = process.env.STOCKS_API_KEY

    const url = `https://eodhd.com/api/eod/MCD.US?api_token=${endOfDayAPIKey}&fmt=json`
}