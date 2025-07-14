import { useGlobal } from '../components/global.jsx'
import TopNav from '../components/topnav.jsx'
import Recommendations from '../components/recommendations.jsx'
import AIAdvisor from '../components/ai-advisor.jsx'
import MarketInsights from '../components/market-insights.jsx'
import SettingsTab from '../components/settings-tab.jsx'




import React, { useState, useEffect } from 'react';
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
  Minus
} from 'lucide-react';

const Dashboard = () => {
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    {
      type: 'ai',
      content: "Hello Alex! Based on your balanced risk profile and ₦150k monthly budget, I'm here to help you make informed investment decisions. What would you like to know?"
    },
    {
      type: 'user',
      content: "Should I invest in banking stocks now?"
    },
    {
      type: 'ai',
      content: "Yes! Banking stocks like GTB and Zenith Bank are attractive now. Rising interest rates improve their margins, and they offer 7-8% dividend yields that match your income goals. Consider allocating 30-40% of your portfolio to this sector."
    }
  ]);

  const { user, activeTab } = useGlobal()
  console.log(user)

  const marketData = [
    { month: 'Jan', ngx: 45000, banking: 350 },
    { month: 'Feb', ngx: 47000, banking: 365 },
    { month: 'Mar', ngx: 49000, banking: 380 },
    { month: 'Apr', ngx: 51000, banking: 395 },
    { month: 'May', ngx: 53000, banking: 410 },
    { month: 'Jun', ngx: 55000, banking: 425 }
  ];

  const allocationData = [
    { name: 'Banking', value: 40, color: '#6366f1' },
    { name: 'Consumer Goods', value: 25, color: '#10b981' },
    { name: 'Telecom', value: 20, color: '#f59e0b' },
    { name: 'Industrial', value: 10, color: '#3b82f6' },
    { name: 'Cash', value: 5, color: '#6b7280' }
  ];

  const recommendations = [
    {
      symbol: 'GTB',
      name: 'Guaranty Trust Bank',
      reason: 'Strong fundamentals, 8.2% dividend yield matches your income goals',
      badge: 'Strong Buy',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      symbol: 'MTN',
      name: 'MTN Nigeria',
      reason: '5G expansion potential, fits your growth allocation',
      badge: 'Buy',
      badgeColor: 'bg-green-100 text-green-800'
    },
    {
      symbol: 'DAN',
      name: 'Dangote Cement',
      reason: 'Infrastructure play, wait for better entry point',
      badge: 'Watch',
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    {
      symbol: 'ZEN',
      name: 'Zenith Bank',
      reason: 'Consistent performer, good for your conservative allocation',
      badge: 'Buy',
      badgeColor: 'bg-green-100 text-green-800'
    },
    {
      symbol: 'FBN',
      name: 'FBN Holdings',
      reason: 'Turnaround story, higher risk but potential upside',
      badge: 'Monitor',
      badgeColor: 'bg-amber-100 text-amber-800'
    }
  ];

  const insights = [
    {
      title: 'Nigerian Banking Sector Outlook',
      description: 'Banks are benefiting from rising interest rates and improved loan quality. Consider increasing allocation to this sector.',
      date: '2 hours ago',
      category: 'Market Analysis'
    },
    {
      title: 'NGX ASI Hits New Highs',
      description: 'The all-share index reached 52-week highs driven by banking and consumer goods sectors.',
      date: '5 hours ago',
      category: 'Market Update'
    },
    {
      title: 'FX Market Stabilization',
      description: 'Naira stability creates opportunities for export-focused companies and reduces FX risk.',
      date: '1 day ago',
      category: 'Economic News'
    }
  ];

  const sendMessage = () => {
    if (chatInput.trim()) {
      const newMessages = [
        ...messages,
        { type: 'user', content: chatInput },
        { 
          type: 'ai', 
          content: getAdvisorResponse(chatInput)
        }
      ];
      setMessages(newMessages);
      setChatInput('');
    }
  };

  const getAdvisorResponse = (question) => {
    const responses = [
      "Based on your balanced risk profile, I recommend a 60-40 split between growth and income stocks. Banking stocks are particularly attractive right now.",
      "Given your ₦150k monthly budget, consider dollar-cost averaging into quality stocks. This reduces timing risk and builds wealth steadily.",
      "The NGX is showing strong momentum in banking and consumer goods. These sectors align well with your investment timeline and risk tolerance.",
      "For your 3-year investment horizon, focus on companies with strong fundamentals and consistent dividend payments like GTB and Zenith Bank.",
      "Market volatility creates opportunities for patient investors. Your balanced approach positions you well to benefit from current market conditions."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl font-bold">
                IS
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">Welcome back, Alex!</h1>
                <p className="text-indigo-200">Your AI-powered investment advisor</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="text-sm text-indigo-200">Monthly Budget</p>
                <p className="text-xl font-semibold">₦150,000</p>
                <p className="text-xs text-indigo-300">3-year horizon</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-orange-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                AK
              </div>
              <div className="px-4 py-2 bg-emerald-500/90 backdrop-blur-sm rounded-full text-sm font-semibold animate-pulse">
                Balanced Investor
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-100 rounded-xl group-hover:bg-emerald-200 transition-colors">
              <Target className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="flex items-center text-emerald-600 text-sm font-medium">
              <Minus className="w-4 h-4 mr-1" />
              Active
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">12</div>
          <div className="text-gray-600 text-sm">Recommendations</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex items-center text-emerald-600 text-sm font-medium">
              <ArrowUp className="w-4 h-4 mr-1" />
              New
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">28</div>
          <div className="text-gray-600 text-sm">Market Insights</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-100 rounded-xl group-hover:bg-amber-200 transition-colors">
              <MessageCircle className="w-6 h-6 text-amber-600" />
            </div>
            <div className="flex items-center text-emerald-600 text-sm font-medium">
              <ArrowUp className="w-4 h-4 mr-1" />
              +24
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">156</div>
          <div className="text-gray-600 text-sm">Questions Answered</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex items-center text-emerald-600 text-sm font-medium">
              <ArrowUp className="w-4 h-4 mr-1" />
              Excellent
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">8.9</div>
          <div className="text-gray-600 text-sm">Advisory Score</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recommendations */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-6 h-6 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">Personalized Recommendations</h2>
          </div>
          
          <div className="space-y-4 mb-8">
            {recommendations.map((rec, index) => (
              <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 hover:shadow-lg transition-all duration-300 hover:translate-x-1">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                  {rec.symbol}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 mb-1">{rec.name}</div>
                  <div className="text-sm text-gray-600">{rec.reason}</div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${rec.badgeColor}`}>
                  {rec.badge}
                </div>
              </div>
            ))}
          </div>

          {/* Profile Completion */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-gray-900">Profile Completion</span>
              <span className="text-amber-600 font-bold">75%</span>
            </div>
            <div className="w-full bg-amber-200 rounded-full h-2 mb-3">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full w-3/4 transition-all duration-500"></div>
            </div>
            <p className="text-sm text-amber-700">Complete your profile for more personalized recommendations</p>
          </div>
        </div>

        {/* AI Chat */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <MessageCircle className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">AI Advisor</h2>
          </div>
          
          <div className="h-80 overflow-y-auto mb-4 space-y-4 bg-gray-50 rounded-xl p-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs p-3 rounded-2xl ${
                  message.type === 'user' 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white ml-auto' 
                    : 'bg-white border border-gray-200 text-gray-900 shadow-sm'
                }`}>
                  {message.type === 'ai' && <div className="font-semibold text-xs text-indigo-600 mb-1">AI ADVISOR</div>}
                  <div className="text-sm">{message.content}</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask about investments, market trends..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
            />
            <button
              onClick={sendMessage}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Market Intelligence */}
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">Market Intelligence</h2>
          </div>
          
          <div className="space-y-4 mb-8">
            {insights.map((insight, index) => (
              <div key={index} className="p-4 border-l-4 border-emerald-500 bg-gradient-to-r from-emerald-50 to-green-50 rounded-r-xl hover:shadow-md transition-all duration-300 cursor-pointer hover:translate-x-1">
                <div className="font-semibold text-gray-900 mb-2">{insight.title}</div>
                <div className="text-sm text-gray-600 mb-2">{insight.description}</div>
                <div className="text-xs text-gray-500">{insight.date} • {insight.category}</div>
              </div>
            ))}
          </div>

          <div className="h-64 bg-gray-50 rounded-xl p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={marketData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '8px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                  }} 
                />
                <Line type="monotone" dataKey="ngx" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }} />
                <Line type="monotone" dataKey="banking" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Advisory Tools */}
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">Advisory Tools</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button className="p-4 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm font-semibold">
              📊 Investment Report
            </button>
            <button className="p-4 bg-gradient-to-br from-emerald-600 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm font-semibold">
              🎯 Update Goals
            </button>
            <button className="p-4 bg-gradient-to-br from-amber-600 to-orange-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm font-semibold">
              ⚖️ Risk Assessment
            </button>
            <button className="p-4 bg-gradient-to-br from-pink-600 to-rose-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 text-sm font-semibold">
              🎓 Learn Investing
            </button>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Allocation</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {allocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Allocation']}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '8px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {allocationData.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-gray-600">{item.name} ({item.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-6">
        <TopNav/>
        {/* Tab Content */}
        <div className="animate-in fade-in duration-500">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'recommendations' && ( <Recommendations/>
            // <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
            //   <h2 className="text-2xl font-bold text-gray-900 mb-6">Detailed Recommendations</h2>
            //   <p className="text-gray-600">This tab will contain detailed investment recommendations...</p>
            // </div>
          )}
          {activeTab === 'portfolio' && (
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Portfolio Analysis</h2>
              <p className="text-gray-600">This tab will show portfolio performance and analysis...</p>
            </div>
          )}
          {activeTab === 'insights' && (<MarketInsights/>)}
          {activeTab === 'chat' && (<AIAdvisor/>)}
          {activeTab === 'settings' && (<SettingsTab/>)}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;