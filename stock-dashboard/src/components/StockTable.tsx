import React from 'react';
import { StockData } from '../types/stock.ts';

interface StockTableProps {
  stocks: StockData[];
  onStockSelect: (symbol: string) => void;
  selectedStock: string | null;
}

const StockTable: React.FC<StockTableProps> = ({ stocks, onStockSelect, selectedStock }) => {
  const formatNumber = (num: number, decimals: number = 2) => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000000) {
      return `${(volume / 1000000000).toFixed(1)}B`;
    } else if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toString();
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200/50">
        <thead>
          <tr className="bg-gradient-to-r from-gray-50/80 to-gray-100/80">
            <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span>Symbol</span>
              </div>
            </th>
            <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <span>Price</span>
              </div>
            </th>
            <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span>Change</span>
              </div>
            </th>
            <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span>Change %</span>
              </div>
            </th>
            <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Volume</span>
              </div>
            </th>
            <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <span>High</span>
              </div>
            </th>
            <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                <span>Low</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200/30">
          {stocks.map((stock) => (
            <tr
              key={stock.symbol}
              onClick={() => onStockSelect(stock.symbol)}
              className={`hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 cursor-pointer transition-all duration-200 ${
                selectedStock === stock.symbol ? 'bg-gradient-to-r from-blue-100/50 to-indigo-100/50 ring-2 ring-blue-200/50' : ''
              }`}
            >
              <td className="px-8 py-5 whitespace-nowrap">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white ${
                    stock.changePercent >= 0 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                      : 'bg-gradient-to-r from-red-500 to-pink-500'
                  }`}>
                    {stock.symbol.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">{stock.symbol}</div>
                    <div className="text-xs text-gray-500">Stock</div>
                  </div>
                </div>
              </td>
              <td className="px-8 py-5 whitespace-nowrap">
                <div className="text-lg font-bold text-gray-900">${formatNumber(stock.price)}</div>
              </td>
              <td className="px-8 py-5 whitespace-nowrap">
                <div className={`text-sm font-semibold ${
                  stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stock.change >= 0 ? '+' : ''}{formatNumber(stock.change)}
                </div>
              </td>
              <td className="px-8 py-5 whitespace-nowrap">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  stock.changePercent >= 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {stock.changePercent >= 0 ? '+' : ''}{formatNumber(stock.changePercent)}%
                </div>
              </td>
              <td className="px-8 py-5 whitespace-nowrap">
                <div className="text-sm text-gray-900 font-medium">{formatVolume(stock.volume)}</div>
              </td>
              <td className="px-8 py-5 whitespace-nowrap">
                <div className="text-sm text-gray-900">${formatNumber(stock.high)}</div>
              </td>
              <td className="px-8 py-5 whitespace-nowrap">
                <div className="text-sm text-gray-900">${formatNumber(stock.low)}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockTable;
