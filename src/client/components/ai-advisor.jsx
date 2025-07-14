import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  TrendingUp, 
  MessageCircle, 
  Target, 
  BarChart3, 
  Award, 
  Send,
  User,
  Settings,
  Bell,
  DollarSign,
  Activity,
  Users,
  Star,
  ArrowUp,
  ArrowDown,
  Minus,
  Bot,
  Lightbulb,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  Bookmark,
  Share2,
  Download,
  Mic,
  Paperclip,
  Smile
} from 'lucide-react';
import { useGlobal } from './global.jsx'
import { getAuth } from 'firebase/auth';


const getUserToken = async () => {
  const user = getAuth().currentUser;
  // if (!user) throw new Error('User not authenticated');
  if (!user) {
    window.location.href = '/auth';
    throw new Error('Redirecting to login');
  }

  return await user.getIdToken();
};

const sendSecureMessage = async (question, profile = {}) => {
  const token = await getUserToken();

  const response = await axios.post(
    '/api/advisor/ask',
    { question, profile },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
};


const AIAdvisor = () => {
  const { activeTab, setActiveTab } = useGlobal();
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Hello Alex! I'm your AI investment advisor. I've analyzed your profile - balanced risk appetite, ₦150k monthly budget, 3-year horizon. I'm here to help you make informed investment decisions in the Nigerian market. What would you like to discuss today?",
      timestamp: new Date(Date.now() - 1800000),
      suggestions: ["Banking stocks outlook", "Portfolio diversification", "Market analysis", "Risk assessment"]
    },
    {
      id: 2,
      type: 'user',
      content: "Should I invest in banking stocks now given the current economic climate?",
      timestamp: new Date(Date.now() - 1200000)
    },
    {
      id: 3,
      type: 'ai',
      content: "Excellent question! Banking stocks are particularly attractive right now for several reasons:\n\n📈 **Rising Interest Rates**: Banks like GTB and Zenith are benefiting from improved net interest margins\n\n💰 **Strong Dividend Yields**: Most tier-1 banks offer 7-8% dividend yields, perfect for your income goals\n\n📊 **Improved Asset Quality**: NPL ratios have been declining across the sector\n\n🎯 **Recommendation**: Consider allocating 30-40% of your portfolio to banking stocks, focusing on GTB, Zenith Bank, and Access Bank.\n\nWould you like me to break down the specific fundamentals of any particular bank?",
      timestamp: new Date(Date.now() - 1000000),
      suggestions: ["GTB analysis", "Zenith Bank details", "Banking sector risks", "Allocation strategy"]
    },
    {
      id: 4,
      type: 'user',
      content: "Tell me more about GTB's fundamentals",
      timestamp: new Date(Date.now() - 600000)
    },
    {
      id: 5,
      type: 'ai',
      content: "Here's my analysis of Guaranty Trust Bank (GTB):\n\n💪 **Financial Strength**:\n• ROE: 28.5% (industry-leading)\n• P/E Ratio: 4.2x (attractive valuation)\n• Book Value: ₦42.50 per share\n\n💸 **Income Generation**:\n• Dividend Yield: 8.2% (consistent payout)\n• Quarterly dividend history shows reliability\n\n🔒 **Risk Factors**:\n• NPL Ratio: 4.1% (well-controlled)\n• Capital Adequacy: 21.8% (strong buffer)\n\n🎯 **My Rating**: **Strong Buy**\n\nGTB fits perfectly with your balanced risk profile and income requirements. Consider it as a core holding in your banking allocation.",
      timestamp: new Date(Date.now() - 300000),
      analysis: {
        rating: "Strong Buy",
        targetPrice: "₦45.00",
        currentPrice: "₦38.50",
        upside: "16.9%"
      }
    }
  ]);

  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  const quickQuestions = [
    { text: "What's the market outlook for Q4?", icon: TrendingUp },
    { text: "Should I increase my tech allocation?", icon: Activity },
    { text: "How to hedge against inflation?", icon: AlertTriangle },
    { text: "Rebalance my portfolio", icon: Target },
    { text: "Best dividend stocks now?", icon: DollarSign },
    { text: "Currency hedging strategies", icon: RefreshCw }
  ];

  const marketAlerts = [
    {
      type: 'positive',
      title: 'Banking Sector Rally',
      message: 'Nigerian banks up 12% this week on rate hike expectations',
      time: '2 hours ago',
      icon: TrendingUp,
      color: 'text-emerald-600 bg-emerald-50'
    },
    {
      type: 'neutral',
      title: 'GTB Earnings Preview',
      message: 'Q3 results expected tomorrow - analyst consensus: ₦8.2 EPS',
      time: '4 hours ago',
      icon: Clock,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      type: 'warning',
      title: 'FX Market Volatility',
      message: 'Naira under pressure - monitor export-focused stocks',
      time: '6 hours ago',
      icon: AlertTriangle,
      color: 'text-amber-600 bg-amber-50'
    }
  ];

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (chatInput.trim()) {
      const userMessage = {
        id: Date.now(),
        type: 'user',
        content: chatInput,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setChatInput('');
      setIsTyping(true);

      // Simulate AI response delay
      setTimeout( async () => {
        const aiResponse = {
          id: Date.now() + 1,
          type: 'ai',
          content: 'Just a sec...',
          timestamp: new Date(),
          suggestions: [], 
          analysis: null
        };
        setMessages(prev => [...prev, aiResponse]);

        try {
          const res = await sendSecureMessage(chatInput, {
            risk: 'balanced',
            budget: 150000,
            horizon: '3 years'
          });

          const answer = res?.answer ?? {}

          
          setMessages(prev => [
              ...prev.slice(0, -1), 
              {
                ...aiResponse, 
                content: answer?.content || 'Sorry, I could not process your request', 
                suggestions: Array.isArray(answer?.suggestions) ? answer?.suggestions : [],  // optional
                analysis: typeof answer.analysis === 'object' ? answer.analysis : null       // optional
              }
            ]);

        } catch(err) {

          console.error(err)
          setMessages(prev => [
            ...prev.slice(0, -1), 
            {
              ...aiResponse, 
              content: 'Error: Failed to connect to the AI advisor.'
            }
          ])
        } finally {
          setIsTyping(false);
        }

      }, 1500 + Math.random() * 1000);
    }
  };



  // const getAdvisorResponse = (question) => {
  //   const lowerQuestion = question.toLowerCase();
    
  //   if (lowerQuestion.includes('market') || lowerQuestion.includes('outlook')) {
  //     return "The Nigerian market is showing strong momentum driven by banking sector performance and improved macroeconomic indicators. Key trends:\n\n📊 **NGX ASI Performance**: Up 18% YTD, outperforming emerging market peers\n\n🏦 **Banking Dominance**: Tier-1 banks leading with strong Q3 earnings\n\n📈 **Sector Rotation**: From defensive to cyclical stocks as confidence improves\n\n🎯 **My Take**: Current market conditions favor your balanced approach. Consider increasing exposure to quality growth names while maintaining defensive positions.";
  //   }
    
  //   if (lowerQuestion.includes('tech') || lowerQuestion.includes('technology')) {
  //     return "Nigerian tech stocks offer compelling growth opportunities but require careful selection:\n\n🚀 **Growth Drivers**:\n• Digital payments adoption accelerating\n• Fintech regulation becoming clearer\n• 5G infrastructure rollout\n\n⚠️ **Risks to Consider**:\n• Valuation concerns in some names\n• Regulatory uncertainty\n• FX exposure for dollar-revenue companies\n\n🎯 **Recommendation**: Limit tech to 15-20% of portfolio. Focus on profitable companies with naira revenue streams.";
  //   }
    
  //   if (lowerQuestion.includes('inflation') || lowerQuestion.includes('hedge')) {
  //     return "Inflation hedging in Nigeria requires a multi-asset approach:\n\n🛡️ **Inflation Hedges**:\n• Banking stocks (benefit from rising rates)\n• Consumer staples with pricing power\n• Real estate investment trusts (REITs)\n• Select commodity-linked stocks\n\n💡 **Strategy for You**:\nGiven your ₦150k monthly budget, focus on assets that can pass through inflation costs. Banking and consumer goods stocks in your current allocation already provide some protection.\n\n🎯 Consider adding REIT exposure for real estate inflation hedge.";
  //   }
    
  //   if (lowerQuestion.includes('dividend') || lowerQuestion.includes('income')) {
  //     return "Top dividend opportunities in the current market:\n\n👑 **Dividend Champions**:\n• GTB: 8.2% yield, 15-year track record\n• Zenith Bank: 7.8% yield, consistent payout\n• Nigerian Breweries: 6.5% yield, defensive\n• Dangote Cement: 5.2% yield, infrastructure play\n\n📊 **Dividend Safety Analysis**:\n✅ Banking dividends well-covered by earnings\n✅ Consumer goods showing resilient cash flows\n⚠️ Industrial dividends under pressure\n\n🎯 **For Your Portfolio**: Banking-heavy dividend strategy aligns perfectly with your income goals and risk profile.";
  //   }
    
  //   // Default responses for other queries
  //   const responses = [
  //     "Based on your balanced risk profile and 3-year investment horizon, I recommend maintaining a diversified approach across sectors. The current market environment favors quality stocks with strong fundamentals.",
  //     "Given your ₦150k monthly budget, dollar-cost averaging remains your best strategy. This approach reduces timing risk and allows you to benefit from market volatility over your 3-year timeline.",
  //     "Your current allocation strategy is sound. The Nigerian market's recent performance in banking and consumer goods sectors aligns well with your investment objectives and risk tolerance.",
  //     "For your investment timeline and goals, focus on companies with sustainable competitive advantages and consistent cash generation. This approach has historically outperformed in the Nigerian market.",
  //     "Market conditions are creating opportunities for patient investors with your investment approach. Your balanced strategy positions you well to capitalize on current market dynamics while managing downside risk."
  //   ];
  //   return responses[Math.floor(Math.random() * responses.length)];
  // };

  // const getContextualSuggestions = (question) => {
  //   const lowerQuestion = question.toLowerCase();
    
  //   if (lowerQuestion.includes('market')) {
  //     return ["Sector rotation strategy", "Market timing tips", "Economic indicators", "Risk management"];
  //   }
  //   if (lowerQuestion.includes('tech')) {
  //     return ["Fintech opportunities", "5G infrastructure plays", "Tech valuations", "Regulatory risks"];
  //   }
  //   if (lowerQuestion.includes('dividend')) {
  //     return ["Dividend aristocrats", "Yield vs growth", "Payout sustainability", "Tax implications"];
  //   }
    
  //   return ["Portfolio review", "Risk assessment", "Market analysis", "Investment strategy"];
  // };

  const handleQuickQuestion = (question) => {
    setChatInput(question);
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion) => {
    setChatInput(suggestion);
    inputRef.current?.focus();
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const renderAIChat = () => (
    <div className="space-y-6">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">AI Investment Advisor</h1>
              <p className="text-indigo-200">Personalized guidance for Nigerian markets</p>
            </div>
          </div>
          <div className="flex items-center gap-2 border-2">
            <div className="px-3 py-1 bg-emerald-500/90 rounded-full text-sm font-medium flex items-center gap-1">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              Online
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Market Alerts Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-indigo-600" />
              Market Alerts
            </h3>
            <div className="space-y-3">
              {marketAlerts.map((alert, index) => {
                const Icon = alert.icon;
                return (
                  <div key={index} className={`p-3 rounded-lg ${alert.color.split(' ')[1]} border ${alert.color.split(' ')[1].replace('bg-', 'border-')}`}>
                    <div className="flex items-start gap-2">
                      <Icon className={`w-4 h-4 mt-0.5 ${alert.color.split(' ')[0]}`} />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-black-900 text-sm mb-1">{alert.title}</div>
                        <div className="text-xs text-gray-600 mb-2">{alert.message}</div>
                        <div className="text-xs text-gray-500">{alert.time}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Questions */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              Quick Questions
            </h3>
            <div className="space-y-2">
              {quickQuestions.map((question, index) => {
                const Icon = question.icon;
                return (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question.text)}
                    className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm group"
                  >
                    <Icon className="w-4 h-4 text-gray-400 group-hover:text-indigo-600" />
                    <span className="text-gray-700 group-hover:text-gray-900">{question.text}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Chat Interface */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 h-[600px] flex flex-col">
            {/* Chat Messages */}
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-gray-50/50 to-white"
            >
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-3xl ${message.type === 'user' ? 'ml-12' : 'mr-12'}`}>
                    {/* Message Header */}
                    <div className={`flex items-center gap-2 mb-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {message.type === 'ai' && (
                        <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <span className="text-xs text-gray-500 font-medium">
                        {message.type === 'ai' ? 'AI Advisor' : 'You'} • {formatTime(message.timestamp)}
                      </span>
                      {message.type === 'user' && (
                        <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Message Content */}
                    <div className={`p-4 rounded-2xl shadow-sm ${
                      message.type === 'user' 
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
                        : 'bg-white border border-gray-200 text-gray-900'
                    }`}>
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      
                      {/* Analysis Card for AI messages */}
                      {message.analysis && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Rating:</span>
                              <span className="ml-2 font-semibold text-emerald-600">{message.analysis.rating}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Target:</span>
                              <span className="ml-2 font-semibold">{message.analysis.targetPrice}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Current:</span>
                              <span className="ml-2 font-semibold">{message.analysis.currentPrice}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Upside:</span>
                              <span className="ml-2 font-semibold text-emerald-600">{message.analysis.upside}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Suggestions */}
                    {message.suggestions && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs hover:bg-indigo-100 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-3xl mr-12">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xs text-gray-500 font-medium">AI Advisor is typing...</span>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="border-t border-gray-200 p-4 bg-white rounded-b-xl">
              <div className="flex items-end gap-3">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder="Ask about investments, market trends, portfolio advice..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none min-h-[48px] max-h-32"
                    rows={1}
                  />
                  <div className="absolute right-3 bottom-3 flex items-center gap-1">
                    <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                      <Smile className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={sendMessage}
                  disabled={!chatInput.trim() || isTyping}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <span>Press Enter to send, Shift+Enter for new line</span>
                <div className="flex items-center gap-2 ml-auto">
                  <button className="hover:text-gray-700 transition-colors">
                    <Bookmark className="w-4 h-4" />
                  </button>
                  <button className="hover:text-gray-700 transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button className="hover:text-gray-700 transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
        <div>
          {activeTab === 'chat' && renderAIChat()}
        </div>
  );
};


export default AIAdvisor;