import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { 
  TrendingUp, 
  TrendingDown,
  Activity, 
  DollarSign,
  AlertTriangle,
  Eye,
  Calendar,
  Globe,
  Users,
  Target,
  ArrowUp,
  ArrowDown,
  Minus,
  Info,
  RefreshCw,
  Filter,
  Download,
  Star,
  Bookmark,
  Share2
} from 'lucide-react';

const MarketInsights = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1M');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const timeframes = ['1D', '1W', '1M', '3M', '6M', '1Y'];
  const categories = [
    { id: 'all', name: 'All Insights' },
    { id: 'banking', name: 'Banking' },
    { id: 'consumer', name: 'Consumer Goods' },
    { id: 'telecom', name: 'Telecom' },
    { id: 'oil', name: 'Oil & Gas' },
    { id: 'industrial', name: 'Industrial' }
  ];

  const marketOverview = [
    { name: 'NGX ASI', value: 55247, change: 2.3, trend: 'up' },
    { name: 'Banking Index', value: 425.8, change: 4.1, trend: 'up' },
    { name: 'Consumer Index', value: 298.6, change: -1.2, trend: 'down' },
    { name: 'Oil & Gas Index', value: 187.4, change: 0.8, trend: 'up' }
  ];

  const performanceData = [
    { month: 'Jan', ngx: 45000, banking: 350, consumer: 280, telecom: 145, oilgas: 165 },
    { month: 'Feb', ngx: 47000, banking: 365, consumer: 285, telecom: 148, oilgas: 170 },
    { month: 'Mar', ngx: 49000, banking: 380, consumer: 290, telecom: 152, oilgas: 175 },
    { month: 'Apr', ngx: 51000, banking: 395, consumer: 295, telecom: 155, oilgas: 180 },
    { month: 'May', ngx: 53000, banking: 410, consumer: 292, telecom: 158, oilgas: 185 },
    { month: 'Jun', ngx: 55000, banking: 425, consumer: 298, telecom: 162, oilgas: 187 }
  ];

  const volumeData = [
    { day: 'Mon', volume: 2.1 },
    { day: 'Tue', volume: 1.8 },
    { day: 'Wed', volume: 2.5 },
    { day: 'Thu', volume: 3.2 },
    { day: 'Fri', volume: 2.9 },
    { day: 'Sat', volume: 1.2 },
    { day: 'Sun', volume: 0.8 }
  ];

  const sectorAllocation = [
    { name: 'Banking', value: 35, color: '#6366f1', change: 2.1 },
    { name: 'Consumer Goods', value: 28, color: '#10b981', change: -0.8 },
    { name: 'Oil & Gas', value: 18, color: '#f59e0b', change: 1.2 },
    { name: 'Telecom', value: 12, color: '#3b82f6', change: 0.5 },
    { name: 'Industrial', value: 7, color: '#8b5cf6', change: -0.3 }
  ];

  const insights = [
    {
      id: 1,
      title: 'Nigerian Banking Sector Shows Strong Q2 Performance',
      description: 'Major banks report improved net interest margins as CBN rate hikes boost profitability. GTB and Zenith Bank lead with strong fundamentals.',
      category: 'banking',
      impact: 'high',
      date: '2 hours ago',
      author: 'Market Research Team',
      tags: ['Banking', 'Earnings', 'Interest Rates'],
      readTime: '3 min read',
      sentiment: 'positive',
      relevanceScore: 9.2
    },
    {
      id: 2,
      title: 'NGX All-Share Index Breaks 55,000 Resistance',
      description: 'The Nigerian stock market hits new 52-week highs driven by banking sector rally and foreign investor inflows.',
      category: 'all',
      impact: 'high',
      date: '4 hours ago',
      author: 'Technical Analysis Team',
      tags: ['NGX', 'Technical Analysis', 'Resistance'],
      readTime: '2 min read',
      sentiment: 'positive',
      relevanceScore: 8.8
    },
    {
      id: 3,
      title: 'Consumer Goods Sector Faces Margin Pressure',
      description: 'Rising input costs and naira volatility impact profitability for FMCG companies. Diversified players better positioned.',
      category: 'consumer',
      impact: 'medium',
      date: '6 hours ago',
      author: 'Sector Analysis Team',
      tags: ['Consumer Goods', 'Margins', 'Currency'],
      readTime: '4 min read',
      sentiment: 'neutral',
      relevanceScore: 7.5
    },
    {
      id: 4,
      title: 'Telecom Sector 5G Rollout Accelerates',
      description: 'MTN Nigeria and Airtel advance 5G infrastructure deployment, creating long-term growth opportunities.',
      category: 'telecom',
      impact: 'medium',
      date: '8 hours ago',
      author: 'Technology Team',
      tags: ['Telecom', '5G', 'Infrastructure'],
      readTime: '3 min read',
      sentiment: 'positive',
      relevanceScore: 8.1
    },
    {
      id: 5,
      title: 'Oil Prices Support Energy Sector Recovery',
      description: 'Brent crude stability above $80 bolsters Nigerian oil companies despite production challenges.',
      category: 'oil',
      impact: 'medium',
      date: '12 hours ago',
      author: 'Energy Team',
      tags: ['Oil & Gas', 'Crude Prices', 'Production'],
      readTime: '3 min read',
      sentiment: 'positive',
      relevanceScore: 7.8
    },
    {
      id: 6,
      title: 'Foreign Portfolio Investment Trends',
      description: 'Analysis of FPI flows shows increased interest in banking and telecom sectors amid policy reforms.',
      category: 'all',
      impact: 'high',
      date: '1 day ago',
      author: 'Foreign Investment Team',
      tags: ['FPI', 'Foreign Investment', 'Policy'],
      readTime: '5 min read',
      sentiment: 'positive',
      relevanceScore: 8.5
    }
  ];

  const economicIndicators = [
    { name: 'Inflation Rate', value: '22.8%', change: -0.3, period: 'May 2024' },
    { name: 'GDP Growth', value: '2.98%', change: 0.1, period: 'Q1 2024' },
    { name: 'Interest Rate', value: '18.75%', change: 0.0, period: 'Current' },
    { name: 'USD/NGN', value: '₦780', change: -2.1, period: 'Current' }
  ];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'text-emerald-600 bg-emerald-50';
      case 'negative': return 'text-red-600 bg-red-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-amber-100 text-amber-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const filteredInsights = selectedCategory === 'all' 
    ? insights 
    : insights.filter(insight => insight.category === selectedCategory);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Activity className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">Market Insights & Analysis</h1>
                <p className="text-blue-200">Real-time market intelligence and sector analysis</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={handleRefresh}
                className={`px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-300 flex items-center gap-2 ${refreshing ? 'animate-pulse' : ''}`}
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh Data
              </button>
              <div className="px-4 py-2 bg-emerald-500/90 backdrop-blur-sm rounded-full text-sm font-semibold animate-pulse">
                Live Updates
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {marketOverview.map((market, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{market.name}</h3>
              <div className={`flex items-center gap-1 text-sm font-medium ${
                market.trend === 'up' ? 'text-emerald-600' : market.trend === 'down' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {market.trend === 'up' ? <ArrowUp className="w-4 h-4" /> : 
                 market.trend === 'down' ? <ArrowDown className="w-4 h-4" /> : 
                 <Minus className="w-4 h-4" />}
                {Math.abs(market.change)}%
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {market.value.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Last 24 hours</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Timeframe:</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                {timeframes.map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedTimeframe(period)}
                    className={`px-3 py-1 text-sm font-medium rounded-md transition-all duration-200 ${
                      selectedTimeframe === period
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-gray-600 hover:text-indigo-600'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center gap-2 text-sm">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Market Performance Chart */}
        <div className="xl:col-span-2 bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Market Performance Trends</h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
              <span>NGX ASI</span>
              <div className="w-3 h-3 bg-emerald-500 rounded-full ml-4"></div>
              <span>Banking</span>
              <div className="w-3 h-3 bg-amber-500 rounded-full ml-4"></div>
              <span>Consumer</span>
            </div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="ngxGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="bankingGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="consumerGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '12px',
                    boxShadow: '0 20px 25px rgba(0,0,0,0.1)'
                  }} 
                />
                <Area type="monotone" dataKey="ngx" stroke="#6366f1" fillOpacity={1} fill="url(#ngxGradient)" strokeWidth={2} />
                <Area type="monotone" dataKey="banking" stroke="#10b981" fillOpacity={1} fill="url(#bankingGradient)" strokeWidth={2} />
                <Area type="monotone" dataKey="consumer" stroke="#f59e0b" fillOpacity={1} fill="url(#consumerGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Economic Indicators & Volume */}
        <div className="space-y-6">
          {/* Economic Indicators */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Key Economic Indicators</h3>
            <div className="space-y-4">
              {economicIndicators.map((indicator, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{indicator.name}</div>
                    <div className="text-xs text-gray-600">{indicator.period}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">{indicator.value}</div>
                    <div className={`text-xs flex items-center gap-1 ${
                      indicator.change > 0 ? 'text-emerald-600' : 
                      indicator.change < 0 ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {indicator.change > 0 ? <ArrowUp className="w-3 h-3" /> : 
                       indicator.change < 0 ? <ArrowDown className="w-3 h-3" /> : 
                       <Minus className="w-3 h-3" />}
                      {Math.abs(indicator.change)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trading Volume */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Weekly Trading Volume</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={volumeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip 
                    formatter={(value) => [`₦${value}B`, 'Volume']}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '8px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Bar dataKey="volume" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Sector Performance & Insights */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Sector Allocation */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Sector Weight Distribution</h3>
          <div className="h-64 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sectorAllocation}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {sectorAllocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Weight']}
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
          <div className="space-y-2">
            {sectorAllocation.map((sector, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: sector.color }}></div>
                  <span className="text-gray-900">{sector.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{sector.value}%</span>
                  <span className={`text-xs ${sector.change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    ({sector.change >= 0 ? '+' : ''}{sector.change}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Market Insights Feed */}
        <div className="xl:col-span-2 bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Latest Market Insights</h3>
            <div className="text-sm text-gray-600">
              {filteredInsights.length} insights
            </div>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredInsights.map((insight) => (
              <div key={insight.id} className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-300 cursor-pointer group hover:border-indigo-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getSentimentColor(insight.sentiment)}`}></div>
                    <h4 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {insight.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(insight.impact)}`}>
                      {insight.impact.toUpperCase()}
                    </span>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Bookmark className="w-4 h-4 text-gray-400 hover:text-indigo-600" />
                    </button>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {insight.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{insight.date}</span>
                    <span>•</span>
                    <span>{insight.readTime}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {insight.relevanceScore}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {insight.tags.slice(0, 2).map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketInsights;