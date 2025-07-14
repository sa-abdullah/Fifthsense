import { ChatGroq } from 'langchain/chat_model.groq'
import { RunnableSequence, RunnableMap } from '@langchain/core/runnables';
import dotenv from 'dotenv'

dotenv.config()

const model = new ChatGroq({
    temperature: 0.7, 
    model: 'llama3-70b-8192', 
    apiKey: process.env.GROQ_API_KEY
})

export const AIAdvisorChain = RunnableSequence.from([
    
    (input) => {
        const formattedContext = formatMarketData(input.marketData)
        return {
            question: input.question, 
            userProfile: input.userProfile, 
            context: formattedContext
        }
    }, 
    RunnableMap.from({
        answer: async ({ question, userProfile,  context }) => {
            const userPrompt = buildUserPrompt({ question, userProfile, context })
            console.log('Prompt:', userPrompt)
            const raw =  await model.invoke([
                {
                    role: 'system', 
                    content: "You are an AI financial advisor focused on the USA stock market for the Nigerian investors. Your answers must be strategic, backed by data, and personalized to the user's profile. Always return structured JSON containing your main advice, optional analysis, and optional suggestions."
                }, 
                {
                    role: 'user', 
                    content: userPrompt
                }
            ])

            try {
                const answer = JSON.parse(raw.content)
                
                return answer.content ? answer : { content: raw.content };

            } catch(err) {
                console.warn('Failed to parse JSON. Returning Raw text')
                return { content: raw.content}
            }
        }
    })
])



const formatMarketData = (stocks) => {
  const lines = stocks.map(stock => {
    return `${stock.symbol} (${stock.name}) — Price: ₦${stock.price}, PE: ${stock.peRatio}, EPS: ${stock.epsTTM}, Sector: ${stock.industry}`;
  });

  return lines.slice(0, 50).join('\n'); // Limit to avoid context overflow
}


const buildUserPrompt = ({ question, userProfile, context }) => {
  return `
Based on the following:

📌 User Profile:
${JSON.stringify(userProfile, null, 2)}

📊 Market Data:
${context}

❓ Question:
${question}

📦 Respond ONLY in this JSON format:
{
  "content": "Main answer here...",
  "suggestions": ["Follow-up 1", "Follow-up 2"], // optional
  "analysis": {
    "rating": "Buy | Hold | Sell",               // optional
    "currentPrice": "₦38.50", 
    "targetPrice": "₦45.00",
    "upside": "16.9%"
  }
}
`.trim();
};


