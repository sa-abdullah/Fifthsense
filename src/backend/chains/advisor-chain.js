import { ChatGroq } from '@langchain/groq'
import { RunnableSequence, RunnablePassthrough } from '@langchain/core/runnables';
import dotenv from 'dotenv'
import { ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts'
import { BufferWindowMemory } from "langchain/memory";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/huggingface_transformers";
import { PineconeStore } from '@langchain/pinecone'
import { Pinecone } from '@pinecone-database/pinecone'
import mongoose from 'mongoose';

dotenv.config()

mongoose.connect(process.env.MONGODB_URI)

const model = new ChatGroq({
    temperature: 0.7, 
    model: 'llama3-70b-8192', 
    apiKey: process.env.GROQ_API_KEY
})

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY
})

const index = pinecone.Index(process.env.PINECONE_INDEX)

//✅ Embeddings & Pinecone Setup for longterm memory
const embeddings = new HuggingFaceTransformersEmbeddings({
  model: "Xenova/all-MiniLM-L6-v2"
});

export const getVectorStore = async() => {
  try {
    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index
    });
    
    if (!vectorStore || typeof vectorStore.asRetriever !== 'function' || typeof vectorStore.addDocuments !== 'function') {
      console.error('Vector store is missing required methods');
      return null;
    }
    
    return vectorStore;
  } catch (error) {
    console.error('Failed to initialize vector store:', error);
    return null;
  }
}

const memoryCache = new Map();

// ✅ Modern approach: Separate retriever function instead of deprecated VectorStoreRetrieverMemory
async function getRelevantHistory(vectorStore, userId, query) {
  if (!vectorStore) return [];
  
  try {
    const retriever = vectorStore.asRetriever({
      filter: { userId }, 
      k: 3 // Fewer docs for history to avoid token limits
    });
    
    const relevantDocs = await retriever.invoke(query);
    return relevantDocs.map(doc => doc.pageContent).join('\n');
  } catch (error) {
    console.error('Error retrieving relevant history:', error);
    return [];
  }
}

export const getOrCreateMemory = async(userId) => {
  if (memoryCache.has(userId)) {
    return memoryCache.get(userId);
  }

  // ✅ Use only BufferWindowMemory - no more deprecated combined memory
  const bufferMemory = new BufferWindowMemory({
    k: 5,
    returnMessages: true,
    memoryKey: "history", 
    inputKey: "input"
  });

  try {
    const vectorStore = await getVectorStore();
    
    const result = { 
      bufferMemory, 
      vectorStore, 
      hasVectorMemory: !!vectorStore
    };

    memoryCache.set(userId, result);
    setTimeout(() => memoryCache.delete(userId), 1000 * 60 * 30);

    console.log(`✅ Memory system initialized for user: ${userId}, hasVector: ${!!vectorStore}`);
    return result;

  } catch (error) {
    console.error('Error creating memory system for user:', userId, error);
    
    const fallbackResult = { 
      bufferMemory, 
      vectorStore: null,
      hasVectorMemory: false
    };
    
    memoryCache.set(userId, fallbackResult);
    setTimeout(() => memoryCache.delete(userId), 1000 * 60 * 30);
    
    return fallbackResult;
  }
}

export const AIAdvisorChain = RunnableSequence.from([
    
    async (input) => {
        const formattedContext = formatMarketData(input.marketData)
        return {
            question: input.question, 
            userProfile: input.userProfile, 
            context: formattedContext,
            hasVectorMemory: input.hasVectorMemory || false,
            vectorStore: input.vectorStore,
            userId: input.userProfile?.uid
        }
    }, 

    // ✅ Add retrieval step for long-term memory
    async ({ question, userProfile, context, hasVectorMemory, vectorStore, userId }) => {
      let longTermHistory = '';
      
      if (hasVectorMemory && vectorStore && userId) {
        try {
          longTermHistory = await getRelevantHistory(vectorStore, userId, question);
          console.log('Long-term history retrieved:', longTermHistory ? 'Yes' : 'No');
        } catch (error) {
          console.error('Failed to retrieve long-term history:', error);
        }
      }
      
      return {
        question,
        userProfile,
        context,
        longTermHistory,
        hasVectorMemory
      };
    },

    async ({ question, userProfile, context, longTermHistory, hasVectorMemory }) => {
      const userPrompt = buildUserPrompt({ question, userProfile, context, longTermHistory })
  
      // ✅ Simplified prompt - no more deprecated memory placeholders
      const messages = [
        SystemMessagePromptTemplate.fromTemplate(systemPrompt),
        new MessagesPlaceholder('history'),
        HumanMessagePromptTemplate.fromTemplate("{input}")
      ];

      const prompt = ChatPromptTemplate.fromMessages(messages);
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

  return lines.slice(0, 50).join('\n');
};

const systemPrompt = `
You are an intelligent, helpful AI assistant with deep expertise in financial markets (especially U.S. stocks and Nigerian investor needs). You can also handle general-purpose queries beyond finance with clarity and friendliness.

Only use the user's financial profile or market data when relevant to the question. If the user asks a casual or unrelated question (e.g., "Hi", "Tell me a joke", "How's the weather?"), respond naturally without referencing their profile or finance.

Always return your answer in valid JSON format with these keys:
- "content": a natural language explanation (required)
- "suggestions": array of short follow-up questions (optional)
- "analysis": object with rating, targetPrice, currentPrice, upside (optional - only for stock evaluations)

Example format:
{{"content": "Hello! How can I help you today?", "suggestions": ["What stocks should I consider?", "How should I diversify my portfolio?"]}}

Rules:
- Only include 'analysis' field if evaluating a specific stock or investment
- Only include 'suggestions' field if absolutely needed
- Always include 'content' field as a string
- If market data unavailable, provide helpful general advice
- For non-finance questions, omit analysis field
- Return single parsable JSON object only
- Never use backticks or explanations outside JSON
`.trim()


const buildUserPrompt = ({ question, userProfile, context, longTermHistory }) => {
  let prompt = `❓ Question:\n${question}\n`

  if (userProfile && Object.keys(userProfile).length > 0) {
    prompt += `\n📌 User Profile:\n${JSON.stringify(userProfile, null, 2)}\n`
  }

  if (context && context.trim().length > 0) {
    prompt += `\n📊 Market Data:\n${context}\n`
  }

  // ✅ Add long-term history if available
  if (longTermHistory && longTermHistory.trim().length > 0) {
    prompt += `\n📚 Relevant Past Conversations:\n${longTermHistory}\n`
  }

  prompt += `
📦 Respond ONLY in JSON format like this example:
{{"content": "Your main answer here...", "suggestions": ["Optional follow-up 1", "Optional follow-up 2"]}}

For stock analysis, include analysis object:
{{"content": "Analysis here...", "analysis": {{"rating": "Buy", "currentPrice": "₦38.50", "targetPrice": "₦45.00", "upside": "16.9%"}}}}
`

  return prompt.trim()
}