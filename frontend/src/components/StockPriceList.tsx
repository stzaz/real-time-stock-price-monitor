// File: src/components/StockPriceList.tsx

'use client';

import { useEffect, useState, useRef } from 'react';

interface StockPrice {
    symbol: string;
    price: number;
    timestamp: string;
}

interface Props {
    onSelectSymbol: (symbol: string) => void;
    selectedSymbol: string;
}

export default function StockPriceList({ onSelectSymbol, selectedSymbol }: Props) {
    const [data, setData] = useState<StockPrice[]>([]);
    const [lastData, setLastData] = useState<Record<string, number>>({});
    const [lastUpdated, setLastUpdated] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const previousData = useRef<Record<string, number>>({});


    const fetchPrices = async () => {
        try {
            const res = await fetch('/api/prices');
            const prices: StockPrice[] = await res.json();

            previousData.current = data.reduce((acc, item) => {
                acc[item.symbol] = item.price;
                return acc;
            }, {});

            setLastData(
                data.reduce((acc, item) => {
                    acc[item.symbol] = item.price;
                    return acc;
                }, {} as Record<string, number>)
            );

            setData(prices);
            setLastUpdated(new Date().toLocaleTimeString());
            setLoading(false);
        } catch (err) {
            console.error('Error fetching stock prices:', err);
        }
    };

    useEffect(() => {
        fetchPrices();
        const interval = setInterval(fetchPrices, 30000); // Refresh every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const getTrend = (symbol: string, current: number) => {
        const previous = previousData.current[symbol];
        if (previous === undefined) return { icon: null, color: '' };
        if (current > previous) return { icon: '🔺', color: 'text-green-600' };
        if (current < previous) return { icon: '🔻', color: 'text-red-600' };
        return { icon: '➖', color: 'text-gray-400' };
    };


    return (
        <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">📈 Live Stock Prices</h2>
            <p className="text-sm text-gray-500 mb-4">Last updated: {lastUpdated}</p>
            {loading ? (
                <p className="text-gray-500 animate-pulse">Loading...</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto border border-gray-200 rounded-lg overflow-hidden">
                        <thead className="bg-gray-100 text-left">
                            <tr>
                                <th className="px-4 py-2 border-b">Symbol</th>
                                <th className="px-4 py-2 border-b">Price</th>
                                <th className="px-4 py-2 border-b">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((stock) => {
                                const { icon, color } = getTrend(stock.symbol, stock.price);
                                return (
                                    <tr
                                        key={stock.symbol}
                                        className={`hover:bg-gray-50 cursor-pointer transition-all ${stock.symbol === selectedSymbol
                                            ? 'bg-blue-50 ring-2 ring-blue-500 font-semibold'
                                            : ''
                                            }`}
                                        onClick={() => onSelectSymbol(stock.symbol)}
                                    >
                                        <td className="px-4 py-2 border-b">{stock.symbol}</td>
                                        <td className="px-4 py-2 border-b flex items-center gap-2">
                                            ${stock.price.toFixed(2)}{' '}
                                            {icon && <span className={`text-sm ${color}`}>{icon}</span>}
                                        </td>
                                        <td className="px-4 py-2 border-b text-sm text-gray-600">
                                            {new Date(stock.timestamp).toLocaleString()}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
