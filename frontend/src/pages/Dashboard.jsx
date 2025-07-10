import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");

    const fetchData = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/dashboard`,
          {
            headers: { Authorization: token },
          }
        );
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error("Error fetching dashboard:", err);
      }
    };

    fetchData();
  }, []);

  if (!data) return <div className="p-8 text-center">Loading...</div>;

  const COLORS = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
    "#8B0000",
    "#228B22",
  ];

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold mb-2">Total Spent</h2>
          <p className="text-2xl font-bold mb-1">₹{data.totalSpent}</p>
          <p className="text-gray-600">
            You’ve used {data.percentUsed}% of your monthly budget.
          </p>
          <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
            <div
              className={`h-3 rounded-full transition-all duration-300 ${
                data.percentUsed >= 90
                  ? "bg-red-700"
                  : data.percentUsed >= 80
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
              style={{
                width: `${data.percentUsed >= 100 ? 100 : data.percentUsed}%`,
              }}
            ></div>
          </div>
        </div>

        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold mb-2">Top Category</h2>
          <p className="text-xl font-bold">{data.topCategory || "N/A"}</p>
        </div>

        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold mb-2">Total Monthly Budget</h2>
          <p className="text-2xl font-bold">₹{data.monthlyBudget}</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-8 p-4 w-full">
        {/* Pie Chart Section - takes ~40% on lg screens */}

        <div className="flex flex-col items-center justify-center w-full">
          <h2 className="text-xl font-bold mb-4">Spending by Category</h2>
          <div className="flex flex-col lg:flex-row items-center justify-center mb-8 lg:mb-0 lg:w-[40%]">
            <div className="mt-4 flex flex-col items-center lg:ml-4">
              {data.pieChart.map((entry, index) => (
                <div key={index} className="flex items-center mb-1">
                  <div
                    className="w-4 h-4 mr-2 rounded"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-sm">{entry.category}</span>
                </div>
              ))}
            </div>
            <div className="w-full h-[270px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    dataKey="total"
                    data={data.pieChart}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {data.pieChart.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Line Chart Section - takes ~60% on lg screens */}
        <div className="flex flex-col items-center justify-center w-full lg:w-[60%]">
          <h2 className="text-xl font-bold mb-4">Spending Over Time</h2>
          <div className="w-full h-[270px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.lineChartData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="total" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
