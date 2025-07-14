import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  DollarSign, 
  Target, 
  MessageCircle, 
  Globe, 
  Moon, 
  Sun, 
  Smartphone, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Save, 
  AlertTriangle,
  ChevronRight,
  BarChart3,
  TrendingUp,
  Clock,
  Palette,
  Database,
  HelpCircle,
  LogOut
} from 'lucide-react';

const SettingsTab = () => {
  const [activeSection, setActiveSection] = useState('profile');
//   const [isDarkMode, setIsDarkMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    marketAlerts: true,
    recommendations: true,
    portfolio: true
  });
  
  const [profile, setProfile] = useState({
    firstName: 'Alex',
    lastName: 'Kemi',
    email: 'alex.kemi@email.com',
    phone: '+234 801 234 5678',
    dateOfBirth: '1990-05-15',
    occupation: 'Software Engineer',
    income: '500000',
    investmentExperience: 'intermediate'
  });

  const [investment, setInvestment] = useState({
    monthlyBudget: '150000',
    riskTolerance: 'balanced',
    investmentHorizon: '3-5 years',
    primaryGoal: 'wealth-building',
    sectors: ['banking', 'telecom', 'consumer-goods'],
    dividendPreference: 'balanced'
  });

  const sections = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'investment', name: 'Investment Preferences', icon: Target },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'data', name: 'Data & Privacy', icon: Database },
    { id: 'help', name: 'Help & Support', icon: HelpCircle }
  ];

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleProfileChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleInvestmentChange = (field, value) => {
    setInvestment(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSectorToggle = (sector) => {
    setInvestment(prev => ({
      ...prev,
      sectors: prev.sectors.includes(sector) 
        ? prev.sectors.filter(s => s !== sector)
        : [...prev.sectors, sector]
    }));
  };

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
          {profile.firstName[0]}{profile.lastName[0]}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{profile.firstName} {profile.lastName}</h3>
          <p className="text-gray-600">{profile.email}</p>
          <button className="text-indigo-600 text-sm font-medium hover:text-indigo-700 mt-1">
            Change Photo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
          <input
            type="text"
            value={profile.firstName}
            onChange={(e) => handleProfileChange('firstName', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
          <input
            type="text"
            value={profile.lastName}
            onChange={(e) => handleProfileChange('lastName', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => handleProfileChange('email', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <input
            type="tel"
            value={profile.phone}
            onChange={(e) => handleProfileChange('phone', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
          <input
            type="date"
            value={profile.dateOfBirth}
            onChange={(e) => handleProfileChange('dateOfBirth', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
          <input
            type="text"
            value={profile.occupation}
            onChange={(e) => handleProfileChange('occupation', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Income (₦)</label>
          <input
            type="number"
            value={profile.income}
            onChange={(e) => handleProfileChange('income', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Investment Experience</label>
          <select
            value={profile.investmentExperience}
            onChange={(e) => handleProfileChange('investmentExperience', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderInvestment = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Investment Budget (₦)</label>
          <input
            type="number"
            value={investment.monthlyBudget}
            onChange={(e) => handleInvestmentChange('monthlyBudget', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Investment Horizon</label>
          <select
            value={investment.investmentHorizon}
            onChange={(e) => handleInvestmentChange('investmentHorizon', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="less-than-1-year">Less than 1 year</option>
            <option value="1-3-years">1-3 years</option>
            <option value="3-5-years">3-5 years</option>
            <option value="5-10-years">5-10 years</option>
            <option value="more-than-10-years">More than 10 years</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">Risk Tolerance</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { value: 'conservative', label: 'Conservative', desc: 'Low risk, steady returns' },
            { value: 'balanced', label: 'Balanced', desc: 'Moderate risk, balanced growth' },
            { value: 'aggressive', label: 'Aggressive', desc: 'High risk, high potential returns' }
          ].map((option) => (
            <div
              key={option.value}
              onClick={() => handleInvestmentChange('riskTolerance', option.value)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                investment.riskTolerance === option.value
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-semibold text-gray-900">{option.label}</div>
              <div className="text-sm text-gray-600">{option.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">Primary Investment Goal</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { value: 'wealth-building', label: 'Wealth Building', icon: TrendingUp },
            { value: 'income-generation', label: 'Income Generation', icon: DollarSign },
            { value: 'capital-preservation', label: 'Capital Preservation', icon: Shield },
            { value: 'retirement-planning', label: 'Retirement Planning', icon: Clock }
          ].map((goal) => {
            const Icon = goal.icon;
            return (
              <div
                key={goal.value}
                onClick={() => handleInvestmentChange('primaryGoal', goal.value)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                  investment.primaryGoal === goal.value
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Icon className="w-5 h-5 text-indigo-600" />
                <div className="font-semibold text-gray-900">{goal.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">Preferred Sectors</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            'banking', 'telecom', 'consumer-goods', 'oil-gas', 'industrial', 
            'technology', 'healthcare', 'real-estate', 'agriculture'
          ].map((sector) => (
            <div
              key={sector}
              onClick={() => handleSectorToggle(sector)}
              className={`p-3 rounded-lg border cursor-pointer transition-all text-center text-sm font-medium ${
                investment.sectors.includes(sector)
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {sector.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">Dividend Preference</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { value: 'high-dividend', label: 'High Dividend', desc: 'Focus on dividend-paying stocks' },
            { value: 'balanced', label: 'Balanced', desc: 'Mix of growth and dividend stocks' },
            { value: 'growth-focused', label: 'Growth Focused', desc: 'Prioritize capital appreciation' }
          ].map((option) => (
            <div
              key={option.value}
              onClick={() => handleInvestmentChange('dividendPreference', option.value)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                investment.dividendPreference === option.value
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-semibold text-gray-900">{option.label}</div>
              <div className="text-sm text-gray-600">{option.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-2">Notification Preferences</h3>
        <p className="text-sm text-gray-600">Choose how you'd like to receive updates about your investments and market changes.</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-gray-500" />
            <div>
              <div className="font-medium text-gray-900">Email Notifications</div>
              <div className="text-sm text-gray-500">Receive updates via email</div>
            </div>
          </div>
          <button
            onClick={() => handleNotificationChange('email')}
            className={`w-12 h-6 rounded-full transition-colors ${
              notifications.email ? 'bg-indigo-600' : 'bg-gray-300'
            }`}
          >
            <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
              notifications.email ? 'translate-x-6' : 'translate-x-0.5'
            }`}></div>
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl">
          <div className="flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-gray-500" />
            <div>
              <div className="font-medium text-gray-900">Push Notifications</div>
              <div className="text-sm text-gray-500">Real-time alerts on your device</div>
            </div>
          </div>
          <button
            onClick={() => handleNotificationChange('push')}
            className={`w-12 h-6 rounded-full transition-colors ${
              notifications.push ? 'bg-indigo-600' : 'bg-gray-300'
            }`}
          >
            <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
              notifications.push ? 'translate-x-6' : 'translate-x-0.5'
            }`}></div>
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-5 h-5 text-gray-500" />
            <div>
              <div className="font-medium text-gray-900">SMS Notifications</div>
              <div className="text-sm text-gray-500">Text messages for urgent alerts</div>
            </div>
          </div>
          <button
            onClick={() => handleNotificationChange('sms')}
            className={`w-12 h-6 rounded-full transition-colors ${
              notifications.sms ? 'bg-indigo-600' : 'bg-gray-300'
            }`}
          >
            <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
              notifications.sms ? 'translate-x-6' : 'translate-x-0.5'
            }`}></div>
          </button>
        </div>
      </div>

      <div className="border-t pt-6">
        <h4 className="font-semibold text-gray-900 mb-4">Content Preferences</h4>
        <div className="space-y-4">
          {[
            { key: 'marketAlerts', label: 'Market Alerts', desc: 'Significant market movements and news' },
            { key: 'recommendations', label: 'New Recommendations', desc: 'AI-generated investment suggestions' },
            { key: 'portfolio', label: 'Portfolio Updates', desc: 'Performance summaries and changes' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <div className="font-medium text-gray-900">{item.label}</div>
                <div className="text-sm text-gray-500">{item.desc}</div>
              </div>
              <button
                onClick={() => handleNotificationChange(item.key)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  notifications[item.key] ? 'bg-indigo-600' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  notifications[item.key] ? 'translate-x-6' : 'translate-x-0.5'
                }`}></div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <h3 className="font-semibold text-gray-900">Security Settings</h3>
        </div>
        <p className="text-sm text-gray-600">Protect your account with strong security measures.</p>
      </div>

      <div className="space-y-4">
        <div className="p-6 bg-white border border-gray-200 rounded-xl">
          <h4 className="font-semibold text-gray-900 mb-4">Change Password</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-12"
                  placeholder="Enter current password"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Confirm new password"
              />
            </div>
            <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors">
              Update Password
            </button>
          </div>
        </div>

        <div className="p-6 bg-white border border-gray-200 rounded-xl">
          <h4 className="font-semibold text-gray-900 mb-4">Two-Factor Authentication</h4>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Enable 2FA</div>
              <div className="text-sm text-gray-500">Add an extra layer of security to your account</div>
            </div>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
              Enable
            </button>
          </div>
        </div>

        <div className="p-6 bg-white border border-gray-200 rounded-xl">
          <h4 className="font-semibold text-gray-900 mb-4">Login Sessions</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">Current Session</div>
                <div className="text-sm text-gray-500">Lagos, Nigeria • Chrome on Windows</div>
              </div>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">Mobile App</div>
                <div className="text-sm text-gray-500">Lagos, Nigeria • iOS App • 2 hours ago</div>
              </div>
              <button className="text-red-600 text-sm hover:text-red-700">Revoke</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearance = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-2">Appearance Settings</h3>
        <p className="text-sm text-gray-600">Customize how your dashboard looks and feels.</p>
      </div>

      <div className="space-y-6">
        <div className="p-6 bg-white border border-gray-200 rounded-xl">
          <h4 className="font-semibold text-gray-900 mb-4">Theme</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border-2 border-indigo-500 bg-indigo-50 rounded-xl cursor-pointer">
              <Sun className="w-6 h-6 text-indigo-600 mb-2" />
              <div className="font-medium text-gray-900">Light</div>
              <div className="text-sm text-gray-500">Clean and bright</div>
            </div>
            <div className="p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-gray-300">
              <Moon className="w-6 h-6 text-gray-600 mb-2" />
              <div className="font-medium text-gray-900">Dark</div>
              <div className="text-sm text-gray-500">Easy on the eyes</div>
            </div>
            <div className="p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-gray-300">
              <Globe className="w-6 h-6 text-gray-600 mb-2" />
              <div className="font-medium text-gray-900">Auto</div>
              <div className="text-sm text-gray-500">Follow system</div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white border border-gray-200 rounded-xl">
          <h4 className="font-semibold text-gray-900 mb-4">Dashboard Layout</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Compact View</div>
                <div className="text-sm text-gray-500">Show more information in less space</div>
              </div>
              <button className="w-12 h-6 bg-gray-300 rounded-full">
                <div className="w-5 h-5 bg-white rounded-full translate-x-0.5"></div>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Show Animations</div>
                <div className="text-sm text-gray-500">Enable smooth transitions and effects</div>
              </div>
              <button className="w-12 h-6 bg-indigo-600 rounded-full">
                <div className="w-5 h-5 bg-white rounded-full translate-x-6"></div>
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white border border-gray-200 rounded-xl">
          <h4 className="font-semibold text-gray-900 mb-4">Data Export</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Download Your Data</div>
                <div className="text-sm text-gray-500">Get a copy of all your account data</div>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                Download
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white border border-gray-200 rounded-xl">
          <h4 className="font-semibold text-gray-900 mb-4">Account Deletion</h4>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="font-medium text-red-900">Danger Zone</span>
            </div>
            <p className="text-sm text-red-700 mb-3">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHelpSupport = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-2">Help & Support</h3>
        <p className="text-sm text-gray-600">Get help when you need it most.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all cursor-pointer">
          <HelpCircle className="w-8 h-8 text-blue-600 mb-4" />
          <h4 className="font-semibold text-gray-900 mb-2">FAQ</h4>
          <p className="text-sm text-gray-600 mb-4">Find answers to common questions</p>
          <div className="flex items-center text-blue-600 text-sm font-medium">
            Browse FAQ <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </div>

        <div className="p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all cursor-pointer">
          <MessageCircle className="w-8 h-8 text-green-600 mb-4" />
          <h4 className="font-semibold text-gray-900 mb-2">Live Chat</h4>
          <p className="text-sm text-gray-600 mb-4">Chat with our support team</p>
          <div className="flex items-center text-green-600 text-sm font-medium">
            Start Chat <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </div>

        <div className="p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all cursor-pointer">
          <Mail className="w-8 h-8 text-purple-600 mb-4" />
          <h4 className="font-semibold text-gray-900 mb-2">Email Support</h4>
          <p className="text-sm text-gray-600 mb-4">Send us a detailed message</p>
          <div className="flex items-center text-purple-600 text-sm font-medium">
            Send Email <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </div>

        <div className="p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-all cursor-pointer">
          <BarChart3 className="w-8 h-8 text-indigo-600 mb-4" />
          <h4 className="font-semibold text-gray-900 mb-2">Tutorials</h4>
          <p className="text-sm text-gray-600 mb-4">Learn how to use our platform</p>
          <div className="flex items-center text-indigo-600 text-sm font-medium">
            Watch Tutorials <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </div>
      </div>

      <div className="p-6 bg-white border border-gray-200 rounded-xl">
        <h4 className="font-semibold text-gray-900 mb-4">Contact Information</h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-gray-500" />
            <span className="text-gray-700">support@investsmart.ng</span>
          </div>
          <div className="flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-gray-500" />
            <span className="text-gray-700">+234 700 INVEST (468378)</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-gray-500" />
            <span className="text-gray-700">Monday - Friday, 9:00 AM - 6:00 PM WAT</span>
          </div>
        </div>
      </div>

      <div className="p-6 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl">
        <div className="flex items-center gap-3 mb-4">
          <LogOut className="w-6 h-6 text-red-600" />
          <h4 className="font-semibold text-gray-900">Sign Out</h4>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Sign out of your account on this device.
        </p>
        <button className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium">
          Sign Out
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfile();
      case 'investment':
        return renderInvestment();
      case 'notifications':
        return renderNotifications();
      case 'security':
        return renderSecurity();
      case 'appearance':
        return renderAppearance();
      case 'data':
        return renderDataPrivacy();
      case 'help':
        return renderHelpSupport();
      default:
        return renderProfile();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="flex flex-col lg:flex-row min-h-[600px]">
        {/* Sidebar */}
        <div className="lg:w-80 bg-gradient-to-b from-gray-50 to-gray-100 border-r border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6 text-indigo-600" />
              <h2 className="text-xl font-bold text-gray-900">Settings</h2>
            </div>
          </div>
          
          <nav className="p-4">
            <div className="space-y-2">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl transition-all ${
                      activeSection === section.id
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-white hover:shadow-md'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{section.name}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="p-8">
            {renderContent()}
          </div>
          
          {/* Save Button */}
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Changes are saved automatically
              </div>
              <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 font-medium">
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default SettingsTab
