"use client";
import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const fetchPaybackData = async () => {
  const response = await fetch("/api/paybacks/list", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ group_id: "7146eef7-5f38-4113-a212-80ee31b63b8a" }),
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

export function Overview() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchPaybackData().then((paybacks) => {
      const processedData = processPaybacks(paybacks);
      setData(processedData);
    });
  }, []);

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
