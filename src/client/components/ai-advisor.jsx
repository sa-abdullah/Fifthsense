import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  TrendingUp, 
  Plus,
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
  History,
  MessageSquare,
  X,
  Paperclip,
  Smile
} from 'lucide-react';
import { useGlobal } from './global.jsx'
import { getAuth, onAuthStateChanged } from 'firebase/auth';
const backendURL = import.meta.env.VITE_BACKEND_URL
console.log("Backend URL is:", backendURL);


const getUserToken = () =>
  new Promise((resolve, reject) => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe(); // prevent multiple calls
      if (user) {
        const token = await user.getIdToken();
        resolve(token);
      } else {
        window.location.href = '/auth';
        reject('Redirecting to login');
      }
    });
  });
  
const sendSecureMessage = async (question, profile = {}, onTokenChunk, sessionId) => {
  
  const token = await getUserToken();
  console.log(token)

  const response = await fetch(
    `${backendURL}/api/advisor/ask`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`, 
        'Content-Type': 'application/json'
      }, 
      body: JSON.stringify({ question, profile, sessionId})
    }
  );
  if (!response.ok) throw new Error('Network response was not ok');

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = '';


  while (true) {
    const { done, value } = await reader.read()
    if (done) break; 

    const chunk = decoder.decode(value, { stream: true })
    const lines = chunk.split('\n\n').filter(Boolean); 

    for (let line of lines) {
      if (line.startsWith('data:')) {
        const payload = line.replace('data:', '').trim();

        try {
          const parsed = JSON.parse(payload)
          if (parsed.done) {
            return {
              content: parsed.content || fullText.trim(), 
              suggestions: parsed.suggestions || [], 
              analysis: parsed.analysis || null 
            }; 
          }
        } catch(err) {
          fullText += payload; 
          if (onTokenChunk) onTokenChunk(payload);
        }
      }
    }
  }

  return {
    content: fullText.trim(),
    suggestions: [],
    analysis: null
  };
};

const AIAdvisor = () => {
  const { activeTab, setActiveTab } = useGlobal();
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarType, setSidebarType] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);

  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);



    // 📌 Load last opened chat from localStorage
  useEffect(() => {
    const savedChat = localStorage.getItem('currentChat');
    if (savedChat) setMessages(JSON.parse(savedChat));
  }, []);

  // 📌 Save current chat to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('currentChat', JSON.stringify(messages));
    }
  }, [messages]);

  // 📌 Fetch chat history from backend
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = await getUserToken();
        const res = await fetch(`${backendURL}/api/advisor/history`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setChatHistory(data);
      } catch (err) {
        console.error('Error fetching chat history:', err);
      }
    };
    fetchHistory();
  }, []);

  // 📌 Fetch messages for a selected session
  const loadHistoryItem = async (sessionId) => {
    try {
      const token = await getUserToken();
      const res = await fetch(`${backendURL}/api/advisor/history/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setMessages(data);
      localStorage.setItem('currentChat', JSON.stringify(data));
      setSidebarOpen(false);
    } catch (err) {
      console.error('Error loading session messages:', err);
    }
  };

  const startNewChat = async () => {
    try {
      const token = await getUserToken();
      const res = await fetch(`${backendURL}/api/advisor/session`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
      });
      const { sessionId } = await res.json();
      setCurrentSessionId(sessionId);

      setMessages([]);
      setChatInput('');
      setIsTyping(false);
      localStorage.removeItem('currentChat');
      setSidebarOpen(false);
      setSidebarType(null);
      setTimeout(() => inputRef.current?.focus(), 100);
    } catch (err) {
      console.error('❌ Failed to start new chat session:', err);
    }
  };


  // const quickQuestions = [
  //   { text: "What's the market outlook for Q4?", icon: TrendingUp },
  //   { text: "Should I increase my tech allocation?", icon: Activity },
  //   { text: "How to hedge against inflation?", icon: AlertTriangle },
  //   { text: "Rebalance my portfolio", icon: Target },
  //   { text: "Best dividend stocks now?", icon: DollarSign },
  //   { text: "Currency hedging strategies", icon: RefreshCw }
  // ];

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

  // const chatHistory = [
  //   {
  //     id: 1,
  //     title: "Portfolio Review & Recommendations",
  //     preview: "Analyzed your current holdings and suggested rebalancing...",
  //     timestamp: new Date(Date.now() - 86400000), // 1 day ago
  //     messageCount: 12
  //   },
  //   {
  //     id: 2,
  //     title: "DANGOTE Stock Analysis",
  //     preview: "Comprehensive analysis of DANGOTE's financial performance...",
  //     timestamp: new Date(Date.now() - 172800000), // 2 days ago
  //     messageCount: 8
  //   },
  //   {
  //     id: 3,
  //     title: "Banking Sector Investment Strategy",
  //     preview: "Discussed investment opportunities in Nigerian banks...",
  //     timestamp: new Date(Date.now() - 259200000), // 3 days ago
  //     messageCount: 15
  //   },
  //   {
  //     id: 4,
  //     title: "Market Outlook for Q4 2024",
  //     preview: "Predictions and recommendations for the final quarter...",
  //     timestamp: new Date(Date.now() - 604800000), // 1 week ago
  //     messageCount: 20
  //   },
  //   {
  //     id: 5,
  //     title: "Dividend Yield Strategy",
  //     preview: "Best dividend-paying stocks on the NGX...",
  //     timestamp: new Date(Date.now() - 1209600000), // 2 weeks ago
  //     messageCount: 6
  //   }
  // ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = (type) => {
    if (sidebarType === type && sidebarOpen) {
      setSidebarOpen(false);
      setSidebarType(null);
    } else {
      setSidebarType(type);
      setSidebarOpen(true);
    }
  };

  
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  let aiMessageAdded = useRef(true)


  const sendMessage = async () => {
    if (chatInput.trim()) {
      
      const userMessage = {
        id: Date.now(),
        role: 'user',
        content: chatInput,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setChatInput('');
      setIsTyping(true);

      const aiResponse = {
        id: Date.now() + 1,
        role: 'ai',
        content: '⌛ AI Advisor is typing...',
        timestamp: new Date(),
        suggestions: [], 
        analysis: null
      };

      setMessages(prev => [...prev, aiResponse]);
      let streamedContent = ''

      try {
        const res = await sendSecureMessage(
          chatInput, 
          {
            risk: 'balanced',
            budget: 150000,
            horizon: '3 years'
          }, 
          (tokenChunk) => {
            streamedContent += tokenChunk; 
            setMessages(prev => {

              if (aiMessageAdded.current) {
                aiMessageAdded.current = false
                return [
                  ...prev, 
                  {
                    ...aiResponse, 
                    content: streamedContent
                  }
                ]
              }

              const last = prev[prev.length - 1]; 
              if (!last || last.role !== 'ai') return prev; 

              return [
                ...prev.slice(0, -1), 
                {
                  ...last, 
                  content: streamedContent
                }
              ]
            })
          }, 
          currentSessionId
        );
        
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (!last || last.role !== 'ai') return prev;

          return [
            ...prev.slice(0, -1), 
            {
              ...last, 
              content: res?.content || streamedContent || 'Sorry, I could not process your request', 
              suggestions: Array.isArray(res?.suggestions) ? res?.suggestions : [],  // optional
              analysis: typeof res?.analysis === 'object' ? res?.analysis : null       // optional
            }
          ]
        });

      } catch(err) {
        console.error(err);
        setMessages(prev => {

          if (!aiMessageAdded) {
            aiMessageAdded = true
            return [
              ...prev, 
              {
                ...aiResponse, 
                content: streamedContent
              }
            ]
          }

          const last = prev[prev.length - 1];
          if (!last || last.role !== 'ai') return prev;
        
          return [
            ...prev.slice(0, -1),
            {
              ...last,
              content: '⚠️ Error: Failed to connect to the AI advisor.',
            },
          ];
        });
      } finally {
        setIsTyping(false);
      }
      // }, 1500 + Math.random() * 1000);
    }
  };

  const handleQuickQuestion = (question) => {
    setChatInput(question);
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion) => {
    setChatInput(suggestion);
    inputRef.current?.focus();
  };

  const formatTime = (date) => {
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d)) return ''; // fallback if invalid
    return d.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };



  const renderSidebar = () => {
    if (!sidebarOpen) return null;

    const sidebarContent = sidebarType === 'alerts' ? (
      <div className="space-y-4 h-[50vh]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-600" />
            Market Alerts
          </h3>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="space-y-3">
          {marketAlerts.map((alert) => {
            const Icon = alert.icon;
            return (
              <div key={alert.id} className={`p-4 rounded-lg ${alert.color} border border-gray-200`}>
                <div className="flex items-start gap-3">
                  <Icon className={`w-5 h-5 mt-0.5 ${alert.color.split(' ')[0]}`} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 mb-1">{alert.title}</div>
                    <div className="text-sm text-gray-700 mb-2">{alert.message}</div>
                    <div className="text-xs text-gray-500">{alert.time}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    ) : (
      <div className="space-y-4 h-[50vh]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-600" />
            Chat History
          </h3>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="space-y-3">
          {chatHistory.map((chat) => (
            <div key={chat.id} onClick={() => loadHistoryItem(chat.id)} className="p-4 rounded-lg hover:bg-gray-50 cursor-pointer border border-gray-200">
              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-indigo-600 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 mb-1">{chat.title}</div>
                  <div className="text-sm text-gray-600 mb-2 line-clamp-2">{chat.preview}</div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{formatTime(chat.timestamp)}</span>
                    <span>•</span>
                    <span>{chat.messageCount} messages</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

    return (
      <div className={`
        ${isMobile ? 'fixed inset-0 bg-black bg-opacity-50 z-50' : 'w-80 flex-shrink-0'}
      `}>
        {isMobile && (
          <div 
            className="absolute inset-0" 
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <div className={`
          ${isMobile 
            ? 'absolute right-0 top-0 h-full w-80 bg-white shadow-xl' 
            : 'bg-white border-l border-gray-200 h-full'
          }
        `}>
          <div className="p-6 h-full overflow-y-auto">
            {sidebarContent}
          </div>
        </div>
      </div>
    );
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
          <div className="flex items-center gap-2">

            {/* New Chat Button */}
            <button
              onClick={startNewChat}
              className="p-2 rounded-lg transition-colors hover:bg-white/10 text-white/80 hover:text-white flex items-center gap-2"
              title="Start New Chat"
            >
              <Plus className="w-5 h-5" />
              {!isMobile && <span className="text-sm font-medium">New Chat</span>}
            </button>

            {/* History Button */}
            <button
              onClick={() => toggleSidebar('history')}
              className={`p-2 rounded-lg transition-colors ${
                sidebarType === 'history' && sidebarOpen 
                  ? 'bg-white/20 text-white' 
                  : 'hover:bg-white/10 text-white/80'
              }`}
            >
              <History className="w-5 h-5" />
            </button>
            
            {/* Alerts Button */}
            <button
              onClick={() => toggleSidebar('alerts')}
              className={`p-2 rounded-lg transition-colors relative ${
                sidebarType === 'alerts' && sidebarOpen 
                  ? 'bg-white/20 text-white' 
                  : 'hover:bg-white/10 text-white/80'
              }`}
            >
              <Bell className="w-5 h-5" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">3</span>
              </div>
            </button>
            
            {/* Online Status */}
            <div className="px-3 py-1 bg-emerald-500/90 rounded-full text-sm font-medium flex items-center gap-1">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              Online
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Desktop Quick Questions Sidebar
        {!isMobile && (
          <div className="w-64 flex-shrink-0">
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
        )} */}

        {/* Main Chat Interface */}
        <div className="flex-1 flex">
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 h-[70vh] flex flex-col">
              {/* Chat Messages */}
              <div 
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-gray-50/50 to-white"
              >
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-3xl ${message.role === 'user' ? 'ml-12' : 'mr-12'}`}>
                      {/* Message Header */}
                      <div className={`flex items-center gap-2 mb-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {message.role === 'ai' && (
                          <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                        )}
                        <span className="text-xs text-gray-500 font-medium">
                          {message.role === 'ai' ? 'AI Advisor' : 'You'} • {formatTime(message.timestamp)}
                        </span>
                        {message.role === 'user' && (
                          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Message Content */}
                      <div className={`p-4 rounded-2xl shadow-sm ${
                        message.role === 'user' 
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
                {/* {isTyping && (
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
                )} */}
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
          
          {/* Sidebar */}
          {renderSidebar()}
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