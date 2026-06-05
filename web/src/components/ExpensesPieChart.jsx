import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AA66CC"
];

export default function ExpensesPieChart() {

  const [data, setData] = useState([]);

  useEffect(() => {

    fetch("http://localhost:3000/dashboard")
      .then((res) => res.json())
      .then((dashboard) => {

        const formatted = Object.entries(
          dashboard.expensesByCategory
        ).map(([name, value]) => ({
          name,
          value
        }));

        setData(formatted);

      });

  }, []);

  return (

    <div
      style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "16px",
        marginTop: "20px"
      }}
    >

      <h2>🍕 Gastos por Categoria</h2>

      <ResponsiveContainer width="100%" height={300}>

        <PieChart>

          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={100}
            label
          >

            {data.map((entry, index) => (

              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />

            ))}

          </Pie>

          <Tooltip />

          <Legend />

        </PieChart>

      </ResponsiveContainer>

    </div>
  );
}