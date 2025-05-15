'use client';

import { useEffect, useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from 'recharts';

interface PricePoint {
    timestamp: string;
    price: number;
}

export default function StockPriceChart({ symbol = 'AAPL' }: { symbol: string }) {
    const [data, setData] = useState<PricePoint[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchHistory = async () => {
        try {
            const res = await fetch(`/api/history?symbol=${symbol}`);
            const prices = await res.json();
            setData(prices);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching price history:', err);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [symbol]);

    return (
        <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">📊 {symbol} Price History</h2>
            {loading ? (
                <p className="text-gray-500">Loading chart...</p>
            ) : (
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="timestamp" tickFormatter={(ts) => new Date(ts).toLocaleTimeString()} />
                        <YAxis domain={['auto', 'auto']} />
                        <Tooltip
                            labelFormatter={(label) => new Date(label).toLocaleString()}
                            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                        />
                        <Line type="monotone" dataKey="price" stroke="#3b82f6" dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}
