import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StockData } from '../types/stock.ts';

interface StockChartProps {
  stock: StockData;
  symbol: string;
}

const StockChart: React.FC<StockChartProps> = ({ stock, symbol }) => {
  // Generate sample data for the chart (in a real app, you'd fetch historical data)
  const generateChartData = (): Array<{ time: string; price: number; volume: number }> => {
    const data: Array<{ time: string; price: number; volume: number }> = [];
    const basePrice = stock.price;
    const volatility = stock.changePercent / 100;
    
    for (let i = 0; i < 24; i++) {
      const time = new Date();
      time.setHours(time.getHours() - (23 - i));
      
      // Generate realistic price movements
      const randomChange = (Math.random() - 0.5) * volatility * 2;
      const price = basePrice * (1 + randomChange);
      
      data.push({
        time: time.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        }),
        price: parseFloat(price.toFixed(2)),
        volume: Math.floor(stock.volume * (0.8 + Math.random() * 0.4))
      });
    }
    
    return data;
  };

  const chartData = generateChartData();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm p-4 border border-gray-200/50 rounded-xl shadow-xl">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-semibold text-gray-800">{`${label}`}</span>
            </div>
            <div className="border-t border-gray-100 pt-2">
              <p className="text-lg font-bold text-gray-900">{`$${payload[0].value}`}</p>
              <p className="text-sm text-gray-600">{`Volume: ${payload[0].payload.volume.toLocaleString()}`}</p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-blue-600 font-medium">Current Price</p>
                <p className="text-xl font-bold text-gray-900">${stock.price.toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          <div className={`p-4 rounded-xl border ${
            stock.change >= 0 
              ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200/50' 
              : 'bg-gradient-to-br from-red-50 to-pink-50 border-red-200/50'
          }`}>
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                stock.change >= 0 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <svg className={`w-5 h-5 ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <p className={`text-sm font-medium ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stock.change >= 0 ? 'Gain' : 'Loss'}
                </p>
                <p className={`text-xl font-bold ${stock.change >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                  {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-purple-600 font-medium">Volume</p>
                <p className="text-xl font-bold text-gray-900">{(stock.volume / 1000000).toFixed(1)}M</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
              <XAxis 
                dataKey="time" 
                stroke="#6b7280"
                fontSize={12}
                tick={{ fill: '#6b7280' }}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tick={{ fill: '#6b7280' }}
                domain={['dataMin - 1', 'dataMax + 1']}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="url(#colorGradient)"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 8, stroke: '#3b82f6', strokeWidth: 3, fill: '#ffffff' }}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.3}/>
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <div className="inline-flex items-center space-x-2 bg-gray-100/80 px-4 py-2 rounded-full">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm text-gray-600">Simulated 24-hour data for demonstration</span>
        </div>
      </div>
    </div>
  );
};

export default StockChart;
