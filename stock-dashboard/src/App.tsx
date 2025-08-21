import React, { useState, useEffect } from 'react';
import StockTable from './components/StockTable.tsx';
import StockChart from './components/StockChart.tsx';
import LoadingSpinner from './components/LoadingSpinner.tsx';
import { StockData } from './types/stock.ts';

function App() {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStock, setSelectedStock] = useState<string | null>(null);

  useEffect(() => {
    // Try to fetch real data, but if it fails, we'll show fallback data
    fetchStockData();
  }, []);

  const fetchStockData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Using Alpha Vantage API with environment variable
      const apiKey = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY;
      
      if (!apiKey) {
        console.warn('API key not found in environment variables. Using demo key.');
        throw new Error('API key not found. Please check your .env file.');
      }
      
             // Try to get data for multiple stocks using GLOBAL_QUOTE endpoint
       const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'];
       let stockArray: StockData[] = [];
       
       // Use GLOBAL_QUOTE endpoint which should work better
       const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbols=${symbols.join(',')}&apikey=${apiKey}`);
       
       if (!response.ok) {
         throw new Error(`Failed to fetch stock data: ${response.status}`);
       }
       
               const data = await response.json();
        console.log('Full API Response:', data);
        console.log('API Response Keys:', Object.keys(data));
        console.log('API Response Values:', Object.values(data));
        console.log('Global Quote Data:', data['Global Quote']);
        console.log('Note Data:', data['Note']);
        console.log('Error Message:', data['Error Message']);
        console.log('Information:', data['Information']);
       
       if (data['Global Quote'] && Object.keys(data['Global Quote']).length > 0) {
         stockArray = Object.keys(data['Global Quote']).map(symbol => {
           const quote = data['Global Quote'][symbol];
           return {
             symbol: symbol,
             price: parseFloat(quote['05. price'] || '0'),
             change: parseFloat(quote['09. change'] || '0'),
             changePercent: parseFloat(quote['10. change percent']?.replace('%', '') || '0'),
             volume: parseInt(quote['06. volume'] || '0'),
             high: parseFloat(quote['03. high'] || '0'),
             low: parseFloat(quote['04. low'] || '0')
           };
         });
       } else if (data['Error Message'] || data['Note']) {
         // If we got an error, try individual stock requests
         console.log('Bulk request failed, trying individual requests...');
         stockArray = [];
         
         for (const symbol of symbols) {
           try {
             // Add delay to avoid rate limiting
             await new Promise(resolve => setTimeout(resolve, 200));
             
             const individualResponse = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`);
             if (individualResponse.ok) {
               const stockData = await individualResponse.json();
               console.log(`Individual ${symbol} response:`, stockData);
               
               if (stockData['Global Quote'] && stockData['Global Quote'][symbol]) {
                 const quote = stockData['Global Quote'][symbol];
                 stockArray.push({
                   symbol: symbol,
                   price: parseFloat(quote['05. price'] || '0'),
                   change: parseFloat(quote['09. change'] || '0'),
                   changePercent: parseFloat(quote['10. change percent']?.replace('%', '') || '0'),
                   volume: parseInt(quote['06. volume'] || '0'),
                   high: parseFloat(quote['03. high'] || '0'),
                   low: parseFloat(quote['04. low'] || '0')
                 });
               }
             }
           } catch (err) {
             console.log(`Error fetching ${symbol}:`, err);
           }
         }
       }
      
      // Check if we got any data
      if (stockArray.length === 0) {
        console.log('No stock data received, using fallback');
        throw new Error('No stock data received');
      }
      
      setStocks(stockArray);
      console.log('Stocks loaded:', stockArray);
    } catch (err) {
      console.log('Error occurred:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      // Fallback data for demo purposes
      setStocks([
        { symbol: 'AAPL', price: 150.25, change: 2.15, changePercent: 1.45, volume: 50000000, high: 152.00, low: 148.50 },
        { symbol: 'MSFT', price: 320.75, change: -1.25, changePercent: -0.39, volume: 30000000, high: 322.00, low: 318.00 },
        { symbol: 'GOOGL', price: 2750.50, change: 15.25, changePercent: 0.56, volume: 15000000, high: 2760.00, low: 2735.00 },
        { symbol: 'AMZN', price: 3200.00, change: 45.50, changePercent: 1.44, volume: 25000000, high: 3210.00, low: 3180.00 },
        { symbol: 'TSLA', price: 850.25, change: -12.75, changePercent: -1.48, volume: 40000000, high: 860.00, low: 845.00 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleStockSelect = (symbol: string) => {
    setSelectedStock(symbol);
  };

  const handleRefresh = () => {
    fetchStockData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Stock Dashboard
                </h1>
                <p className="mt-1 text-sm text-gray-500">Real-time market insights & analytics</p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh Data</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-8 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-800">Unable to load stock data</h3>
                <div className="mt-2 text-red-700">{error}</div>
                <p className="mt-3 text-sm text-red-600">Showing demo data for demonstration purposes.</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Stocks</p>
                <p className="text-2xl font-bold text-gray-900">{stocks.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${stocks.reduce((sum, stock) => sum + stock.price, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Top Performer</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stocks.length > 0 ? stocks.reduce((max, stock) => stock.changePercent > max.changePercent ? stock : max).symbol : 'N/A'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Volume</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(stocks.reduce((sum, stock) => sum + stock.volume, 0) / 1000000).toFixed(1)}M
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stock Table */}
        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl mb-8 border border-gray-200/50 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200/50 bg-gradient-to-r from-gray-50 to-gray-100/50">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <svg className="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Market Overview
            </h2>
          </div>
          <StockTable 
            stocks={stocks} 
            onStockSelect={handleStockSelect}
            selectedStock={selectedStock}
          />
        </div>

        {/* Stock Chart */}
        {selectedStock && (
          <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200/50 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-200/50 bg-gradient-to-r from-gray-50 to-gray-100/50">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <svg className="w-5 h-5 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
                {selectedStock} Performance Chart
              </h2>
            </div>
            <div className="p-8">
              <StockChart 
                stock={stocks.find(s => s.symbol === selectedStock)!}
                symbol={selectedStock}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
