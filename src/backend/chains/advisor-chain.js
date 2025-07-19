import { ChatGroq } from '@langchain/groq'
import { RunnableSequence } from '@langchain/core/runnables';
import dotenv from 'dotenv'
import { ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate } from '@langchain/core/prompts'
import { Readable } from 'stream'

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

    async ({ question, userProfile,  context }) => {
      const userPrompt = buildUserPrompt({ question, userProfile, context })
      console.log('userPrompt:', userPrompt)
  
      const prompt = ChatPromptTemplate.fromMessages([
        SystemMessagePromptTemplate.fromTemplate(systemPrompt), 
        HumanMessagePromptTemplate.fromTemplate("{input}")
      ])

      const chain = prompt.pipe(model)

      return { chain, userPrompt }
    }
  
])



const formatMarketData = (stocks) => {
  if (!stocks || stocks.length === 0) {
    return "Market data is currently unavailable. I can still help with general investment questions and analysis.";
  }
  const lines = stocks.map(stock => {
    return `${stock.symbol} (${stock.securityName}) — Open: ₦${stock.open}, Close: ₦${stock.close}, Change: ${stock.change}, Volume: ${stock.dailyVolume}`;
  });

  return lines.slice(0, 50).join('\n'); // ✅ Convert to string
};






const systemPrompt = `
You are an intelligent, helpful AI assistant with deep expertise in financial markets (especially U.S. stocks and Nigerian investor needs). You can also handle general-purpose queries beyond finance with clarity and friendliness.

Only use the user's financial profile or market data when relevant to the question. If the user asks a casual or unrelated question (e.g., "Hi", "Tell me a joke", "How's the weather?"), respond naturally without referencing their profile or finance.

Always return your answer in **valid JSON format** with the following keys:
{{
  "content": "<a natural language explanation>",
  "suggestions": ["<short follow-up questions>"],
  "analysis": {{
    "rating": "Buy/Sell/Hold",
    "targetPrice": "₦45.00",
    "currentPrice": "₦38.50",
    "upside": "16.9%"
}}
// Only include the 'analysis' field if your answer includes evaluation of a specific stock or investment.
// Only include the 'suggestions' field if absolutely needed
// You must always return the 'content' field and it must always be a string
// If market data is unavailable, mention this in your response but still provide helpful general advice
}}
If the question is unrelated to finance or analysis, leave out the analysis field.
Ensure the entire response is a single parsable JSON object.
NEVER wrap with backticks or triple backticks.
NEVER include explanation outside the JSON.
`.trim()






const buildUserPrompt = ({ question, userProfile, context }) => {
  let prompt = `❓ Question:\n${question}\n`

  if (userProfile && Object.keys(userProfile).length > 0) {
    prompt += `\n📌 User Profile:\n${JSON.stringify(userProfile, null, 2)}\n`
  }

  if (context && context.trim().length > 0) {
    prompt += `\n📊 Market Data:\n${context}\n`
  }

  prompt += `
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
`

  return prompt.trim()
}


