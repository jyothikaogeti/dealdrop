"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { getPriceHistory } from "@/actions/product.actions";

export default function PriceChart({ productId }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);

        if (!productId) {
          setData([]);
          return;
        }

        const history = await getPriceHistory(productId);
        const safeHistory = Array.isArray(history) ? history : [];

        const chartData = safeHistory.map((item) => ({
          date: new Date(item.checked_at).toLocaleDateString(),
          price: parseFloat(item.price),
        }));

        setData(chartData);
      } catch (error) {
        console.error("Failed to load price history:", error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [productId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center text-gray-500 w-full py-8">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        Loading Chart...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full text-gray-500 text-center py-8">
        No Price History Yet. Check back after the Daily Update.
      </div>
    );
  }

  return (
    <div className="w-full">
      <h4 className="text-gray-700 text-sm font-semibold mb-4">
        Price History
      </h4>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
          <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
            }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#FA5D19"
            strokeWidth={2}
            dot={{ fill: "#FA5D19", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
