"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Props {
  data: {
    bulan: string;
    saldo: number;
    masuk: number;
    keluar: number;
  }[];
}

export default function FinanceChart({
  data,
}: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* SALDO */}
      <div className="rounded-2xl bg-white p-4 shadow">
        <h3 className="mb-4 font-semibold">
          Saldo Bulanan
        </h3>

        <div className="h-[220px]">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="bulan" />

              <YAxis hide />

              <Tooltip
                formatter={(value) =>
                `Rp ${Number(value).toLocaleString(
                    "id-ID"
                )}`
                }
              />

              <Line
                type="monotone"
                dataKey="saldo"
                stroke="#16a34a"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* PEMASUKAN */}
      <div className="rounded-2xl bg-white p-4 shadow">
        <h3 className="mb-4 font-semibold">
          Pemasukan
        </h3>

        <div className="h-[220px]">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="bulan" />

              <YAxis hide />

              <Tooltip
                formatter={(value) =>
                    `Rp ${Number(value).toLocaleString(
                        "id-ID"
                    )}`
                    }
              />

              <Bar
                dataKey="masuk"
                fill="#2563eb"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* PENGELUARAN */}
      <div className="rounded-2xl bg-white p-4 shadow">
        <h3 className="mb-4 font-semibold">
          Pengeluaran
        </h3>

        <div className="h-[220px]">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="bulan" />

              <YAxis hide />

              <Tooltip
                formatter={(value) =>
                `Rp ${Number(value).toLocaleString(
                    "id-ID"
                )}`
                }
              />

              <Bar
                dataKey="keluar"
                fill="#ef4444"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}