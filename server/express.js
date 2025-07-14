import express from 'express'
import cors from 'cors'
import router from '../src/backend/routes/router.js'
// import recRouter from '../src/backend/routes/rec-router.js'
// import insightRouter from '../src/backend/routes/insights-router.js'
import advisorRouter from '../src/backend/routes/adv-router.js'
import dotenv from 'dotenv'

dotenv.config()


const app = express()

app.use(cors())
app.use(express.json());


app.use('/api/stocks', router)
// app.use('/api/recommendations', recRouter)
// app.use('/api/insights', insightRouter)
app.use('/api/advisor', advisorRouter)


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`)
})




