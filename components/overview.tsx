"use client";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Text,
} from "recharts";

const fetchPaybackData = async ({ group_id }) => {
  const response = await fetch("/api/paybacks/list", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ group_id: group_id }),
  });
  const data = await response.json();
  return data;
};

const processPaybacks = (paybacks) => {
  const paybacksByDay = paybacks.reduce((acc, payback) => {
    const day = new Date(payback.creation_date).toISOString().split("T")[0];
    if (!acc[day]) {
      acc[day] = 0;
    }
    acc[day] += payback.amount;
    return acc;
  }, {});

  const dates = Object.keys(paybacksByDay);
  const startDate = new Date(Math.min(...dates.map((date) => new Date(date))));
  const endDate = new Date(Math.max(...dates.map((date) => new Date(date))));
  const allDates = [];
  for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    allDates.push(new Date(d).toISOString().split("T")[0]);
  }

  return allDates.map((date) => ({
    name: date,
    total: paybacksByDay[date] || 0,
  }));
};

export function Overview({ group_id }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchPaybackData({ group_id }).then((paybacks) => {
      const processedData = processPaybacks(paybacks);
      setData(processedData);
    });
  }, [group_id]);

  if (data.length === 0) {
    return (
      <div className="flex justify-center items-center h-max">
        No data to display
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Bar
          dataKey="total"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
