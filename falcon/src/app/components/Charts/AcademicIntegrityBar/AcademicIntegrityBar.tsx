"use client";

import React from "react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface DataItem {
  name: string;
  value: number;
}

const COLORS = ["#47cd89", "#EED202", "#F36960"]; // Base colors
const DARKENED_COLORS = ["#3ca778", "#d9c101", "#e0524e"];

export interface Props {
  data: DataItem[];
}

const AcademicIntegrityBar: React.FC<Props> = ({ data }) => {
  const transformedData = [
    {
      ...data.reduce((acc, item) => ({ ...acc, [item.name]: item.value }), {}),
    },
  ];

  return (
    <div style={{ width: "100%", height: 24 }}>
      <ResponsiveContainer>
        <BarChart
          data={transformedData}
          layout="vertical"
          barGap={0}
          barSize={24}
        >
          <defs>
            {COLORS.map((color, index) => (
              <linearGradient
                key={index}
                id={`colorUv${index}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                <stop
                  offset="95%"
                  stopColor={DARKENED_COLORS[index]}
                  stopOpacity={0.8}
                />
              </linearGradient>
            ))}
          </defs>
          <XAxis type="number" hide domain={[0, "dataMax"]} />
          <YAxis type="category" dataKey="name" hide />
          <Tooltip
            cursor={{ fill: "transparent" }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white rounded-lg border border-grey-200 p-2 shadow-sm mt-4">
                    <div className="flex flex-row gap-2">
                      <div className="flex flex-row pr-2 gap-1 border-r border-grey-200">
                        <span className="text-xs uppercase font-semibold text-grey-800">
                          {payload[0].value}
                        </span>
                        <span className="font-medium text-xs text-grey-800">
                          Acceptable
                        </span>
                      </div>
                      <div className="flex flex-row gap-1 pr-2 border-r border-grey-200">
                        <span className="text-xs uppercase font-semibold text-grey-800">
                          {payload[1].value}
                        </span>
                        <span className="font-medium text-xs text-grey-800">
                          Warnings
                        </span>
                      </div>
                      <div className="flex flex-row gap-1">
                        <span className="text-xs uppercase font-semibold text-grey-800">
                          {payload[2].value}
                        </span>
                        <span className="font-medium text-xs text-grey-800">
                          Severe
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          {data.map((entry, index) => (
            <Bar
              key={entry.name}
              dataKey={entry.name}
              stackId="a"
              fill={`url(#colorUv${index % COLORS.length})`}
              radius={4}
              stroke="#FFFFFF"
              strokeWidth={2}
            >
              {transformedData.map((cell, cellIndex) => (
                <Cell key={`cell-${cellIndex}`} />
              ))}
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AcademicIntegrityBar;
