// import { useState, useEffect } from 'react'
import { useGlobal } from './global.jsx'

import { Target, Star, } from 'lucide-react';



const Recommendations = () => {

    const { activeTab } = useGlobal()

    return (
       <>
        {activeTab === 'recommendations' && (
            <div className="space-y-8">
              {/* Header */}
              <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <Target className="w-8 h-8" />
                    <h1 className="text-3xl font-bold">Investment Recommendations</h1>
                  </div>
                  <p className="text-indigo-200 max-w-2xl">Personalized investment suggestions based on your balanced risk profile, ₦150k monthly budget, and 3-year investment horizon.</p>
                </div>
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
              </div>

              {/* Filter Tabs */}
              <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
                <div className="flex flex-wrap gap-2 mb-6">
                  <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-medium">
                    All Recommendations
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                    Strong Buy
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                    Banking
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                    Consumer Goods
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                    Telecom
                  </button>
                </div>

                {/* Top Picks */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    Top Picks for You
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-2xl p-6 relative">
                      <div className="absolute top-4 right-4">
                        <div className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                          STRONG BUY
                        </div>
                      </div>
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-emerald-600 to-green-600 rounded-xl flex items-center justify-center text-white font-bold">
                          GTB
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">Guaranty Trust Bank</h3>
                          <p className="text-emerald-700 text-sm font-medium">Banking • NGX: GTCO</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-600">Current Price</p>
                          <p className="font-bold text-gray-900">₦28.50</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Target Price</p>
                          <p className="font-bold text-emerald-600">₦35.00</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Dividend Yield</p>
                          <p className="font-bold text-gray-900">8.2%</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Upside Potential</p>
                          <p className="font-bold text-emerald-600">+23%</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-4">Strong fundamentals with consistent dividend payments. Rising interest rates boost net interest margins. Perfect for your income-focused allocation.</p>
                      <div className="flex gap-2">
                        <button className="flex-1 bg-emerald-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">
                          Add to Watchlist
                        </button>
                        <button className="px-4 py-2 border border-emerald-600 text-emerald-600 rounded-lg text-sm font-medium hover:bg-emerald-50 transition-colors">
                          Details
                        </button>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 relative">
                      <div className="absolute top-4 right-4">
                        <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                          BUY
                        </div>
                      </div>
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">
                          MTN
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">MTN Nigeria</h3>
                          <p className="text-blue-700 text-sm font-medium">Telecom • NGX: MTNN</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-600">Current Price</p>
                          <p className="font-bold text-gray-900">₦165.00</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Target Price</p>
                          <p className="font-bold text-blue-600">₦200.00</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Dividend Yield</p>
                          <p className="font-bold text-gray-900">6.5%</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Upside Potential</p>
                          <p className="font-bold text-blue-600">+21%</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-4">5G network expansion and fintech services growth. Strong cash flows support dividend sustainability. Ideal for growth component of your portfolio.</p>
                      <div className="flex gap-2">
                        <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                          Add to Watchlist
                        </button>
                        <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* All Recommendations */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">All Recommendations</h2>
                  <div className="space-y-4">
                    {[
                      {
                        symbol: 'ZEN',
                        name: 'Zenith Bank Plc',
                        sector: 'Banking',
                        price: '₦24.80',
                        target: '₦30.00',
                        dividend: '7.5%',
                        upside: '+21%',
                        rating: 'BUY',
                        ratingColor: 'bg-green-500',
                        reason: 'Consistent performer with strong loan book quality. Digital banking initiatives driving efficiency.',
                        risk: 'Medium',
                        allocation: '15%'
                      },
                      {
                        symbol: 'BUAC',
                        name: 'BUA Cement Plc',
                        sector: 'Industrial',
                        price: '₦85.50',
                        target: '₦95.00',
                        dividend: '4.2%',
                        upside: '+11%',
                        rating: 'BUY',
                        ratingColor: 'bg-green-500',
                        reason: 'Infrastructure spending and construction activity recovery. Capacity expansion completed.',
                        risk: 'Medium',
                        allocation: '8%'
                      },
                      {
                        symbol: 'NB',
                        name: 'Nigerian Breweries',
                        sector: 'Consumer Goods',
                        price: '₦45.20',
                        target: '₦55.00',
                        dividend: '5.8%',
                        upside: '+22%',
                        rating: 'BUY',
                        ratingColor: 'bg-green-500',
                        reason: 'Market leader in beverages. FX stability improves input costs and margins.',
                        risk: 'Medium',
                        allocation: '12%'
                      },
                      {
                        symbol: 'DAN',
                        name: 'Dangote Cement',
                        sector: 'Industrial',
                        price: '₦285.00',
                        target: '₦310.00',
                        dividend: '3.5%',
                        upside: '+9%',
                        rating: 'WATCH',
                        ratingColor: 'bg-amber-500',
                        reason: 'Wait for better entry point. Strong fundamentals but current valuation is stretched.',
                        risk: 'Low',
                        allocation: '5%'
                      },
                      {
                        symbol: 'FBN',
                        name: 'FBN Holdings',
                        sector: 'Banking',
                        price: '₦12.40',
                        target: '₦18.00',
                        dividend: '6.0%',
                        upside: '+45%',
                        rating: 'MONITOR',
                        ratingColor: 'bg-amber-500',
                        reason: 'Turnaround story with new management. Higher risk but significant upside potential.',
                        risk: 'High',
                        allocation: '5%'
                      },
                      {
                        symbol: 'ACCESS',
                        name: 'Access Holdings',
                        sector: 'Banking',
                        price: '₊15.80',
                        target: '₦19.50',
                        dividend: '7.2%',
                        upside: '+23%',
                        rating: 'BUY',
                        ratingColor: 'bg-green-500',
                        reason: 'Strong retail banking franchise. Digital transformation paying off with lower costs.',
                        risk: 'Medium',
                        allocation: '10%'
                      }
                    ].map((stock, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                              {stock.symbol}
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900">{stock.name}</h3>
                              <p className="text-gray-600 text-sm">{stock.sector}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`${stock.ratingColor} text-white px-3 py-1 rounded-full text-xs font-bold mb-2`}>
                              {stock.rating}
                            </div>
                            <div className="text-xs text-gray-600">Recommended: {stock.allocation}</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-gray-600">Current Price</p>
                            <p className="font-bold text-gray-900">{stock.price}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Target Price</p>
                            <p className="font-bold text-green-600">{stock.target}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Dividend Yield</p>
                            <p className="font-bold text-gray-900">{stock.dividend}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Upside</p>
                            <p className="font-bold text-green-600">{stock.upside}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Risk Level</p>
                            <p className={`font-bold text-sm ${
                              stock.risk === 'Low' ? 'text-green-600' : 
                              stock.risk === 'Medium' ? 'text-amber-600' : 'text-red-600'
                            }`}>{stock.risk}</p>
                          </div>
                        </div>

                        <p className="text-sm text-gray-700 mb-4">{stock.reason}</p>

                        <div className="flex flex-wrap gap-2">
                          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                            Add to Portfolio
                          </button>
                          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                            View Analysis
                          </button>
                          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                            Compare
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Investment Strategy Summary */}
                <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Your Investment Strategy Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold text-indigo-900 mb-2">Risk Profile</h4>
                      <p className="text-sm text-gray-700">Balanced investor seeking moderate growth with steady income through dividends.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-indigo-900 mb-2">Time Horizon</h4>
                      <p className="text-sm text-gray-700">3-year investment period allows for medium-term growth strategies.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-indigo-900 mb-2">Monthly Budget</h4>
                      <p className="text-sm text-gray-700">₦150,000 monthly for systematic investment through dollar-cost averaging.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
    )
}


export default Recommendations