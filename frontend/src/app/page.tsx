// File: src/app/page.tsx

'use client';

import { useState } from 'react';
import StockPriceList from '@/components/StockPriceList';
import StockPriceChart from '@/components/StockPriceChart';

const STOCK_OPTIONS = [
  'AAPL', 'MSFT', 'GOOG', 'TSLA', 'AMZN',
  'NVDA', 'META', 'NFLX', 'INTC', 'AMD'
];

export default function HomePage() {
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📊 Real-Time Stock Price Dashboard</h1>

      {/* Table of current prices with selection */}
      <section className="mb-12">
        <StockPriceList onSelectSymbol={setSelectedSymbol} selectedSymbol={selectedSymbol} />
      </section>

      {/* Dropdown to select stock for chart */}
      <div className="mb-6">
        <label htmlFor="symbol" className="block mb-2 text-sm font-medium text-gray-700">
          Select stock to view chart:
        </label>
        <select
          id="symbol"
          className="border border-gray-300 rounded-md p-2 text-sm"
          value={selectedSymbol}
          onChange={(e) => setSelectedSymbol(e.target.value)}
        >
          {STOCK_OPTIONS.map((symbol) => (
            <option key={symbol} value={symbol}>
              {symbol}
            </option>
          ))}
        </select>
      </div>

      {/* Chart for selected stock */}
      <section>
        <StockPriceChart symbol={selectedSymbol} />
      </section>
    </main>
  );
}
