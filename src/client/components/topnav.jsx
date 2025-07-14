import { Icon, BarChart3, Target, TrendingUp, Activity, MessageCircle, Settings } from 'lucide-react'
import { useGlobal } from '../components/global.jsx'




const TopNav = () => {
    const { activeTab, setActiveTab }  = useGlobal()
    const tabs = [
    { id: 'overview', name: 'Dashboard', icon: BarChart3 },
    { id: 'recommendations', name: 'Recommendations', icon: Target },
    { id: 'portfolio', name: 'Portfolio', icon: TrendingUp },
    { id: 'insights', name: 'Market Insights', icon: Activity },
    { id: 'chat', name: 'AI Advisor', icon: MessageCircle },
    { id: 'settings', name: 'Settings', icon: Settings }
    
  ];

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 mb-8 shadow-xl border border-white/20 sticky top-6 z-50">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>
    )
}

export default TopNav
