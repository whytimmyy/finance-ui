import { useState } from "react";
import { useEffect } from "react";  
import "./styles.css";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

import {
  initialData,
  calculateSummary,
  filterTransactions,
  getHighestSpendingCategory,
  getMonthlyComparison,
  getCategoryData
} from "./logic";


export default function App() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => { 
    fetch("http://localhost:3001/transactions")
      .then((res) => res.json())
      .then((data) => setTransactions(data));
  }, []);
  const [filter, setFilter] = useState("all");
  const [role, setRole] = useState("viewer");


  const [formData, setFormData] = useState({
    date: "",
    amount: "",
    category: "",
    type: "expense",
  });

  const { income, expenses, balance } = calculateSummary(transactions);
  const filtered = filterTransactions(transactions, filter);
  const { maxCategory, maxAmount } = getHighestSpendingCategory(transactions);
  const monthly = getMonthlyComparison(transactions);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleAdd = () => {
  if (!formData.date || !formData.amount || !formData.category) return;

  const newTx = {
    date: formData.date,
    amount: Number(formData.amount),
    category: formData.category,
    type: formData.type,
  };

  fetch("http://localhost:3001/transactions", {   // ✅ FIXED
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newTx),
  })
    .then((res) => res.json())
    .then((data) => {
      setTransactions((prev) => [...prev, data]); // ✅ better
    });

  setFormData({
    date: "",
    amount: "",
    category: "",
    type: "expense",
  });
};

  const categoryData = getCategoryData(transactions);
  const [darkMode, setDarkMode] = useState(false);

  return (
  <div className={`container ${darkMode ? "dark" : ""}`}>

    {/* Header */}
    <div className="header">
      <h1>Finance Dashboard</h1>

      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="viewer">Viewer</option>
          <option value="admin">Admin</option>
        </select>

        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
    </div>

    {/* ===== SUMMARY CARDS ===== */}
    <div className="section">
      <div className="cards">
        <div className="card">
          <p>Total Balance</p>
          <h2>₹{balance}</h2>
        </div>

        <div className="card income">
          <p>Income</p>
          <h2>₹{income}</h2>
        </div>

        <div className="card expense">
          <p>Expenses</p>
          <h2>₹{expenses}</h2>
        </div>
      </div>
    </div>

    {/* ===== TRANSACTIONS ===== */}
    <div className="section">
      <h3>Transactions</h3>

      {/* Controls */}
      <div className="controls">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      {/* Add Form */}
      {role === "admin" && (
        <div style={{ marginBottom: "15px" }}>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />

          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleChange}
          />

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
          />

          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <button onClick={handleAdd}>Add</button>
        </div>
      )}

      {/* Table */}
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Type</th>
          </tr>
        </thead>

        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan="4">No transactions yet. Add one!</td>
            </tr>
          ) : (
            filtered.map((t) => (
              <tr key={t.id}>
                <td>{t.date}</td>
                <td>{t.category}</td>

                {/* 🔥 Improved amount UI */}
                <td>
                  <span
                    style={{
                      color: t.type === "expense" ? "#ef4444" : "#22c55e",
                      fontWeight: "600",
                    }}
                  >
                    {t.type === "expense" ? "-" : "+"}₹{t.amount}
                  </span>
                </td>

                <td>{t.type}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>

    {/* ===== INSIGHTS ===== */}
    <div className="section">
      <h3>Insights</h3>

      <div className="insights">
        <p>
          <strong>Highest Spending Category:</strong> {maxCategory} (₹{maxAmount})
        </p>

        <p>
          <strong>This Month Income:</strong> ₹{monthly.income}
        </p>

        <p>
          <strong>This Month Expenses:</strong> ₹{monthly.expenses}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          {monthly.income > monthly.expenses ? "Saving" : "Overspending"}
        </p>
      </div>
    </div>

    {/* ===== PIE CHART ===== */}
    <div className="section">
      <div className="card">
        <h3>Spending Breakdown</h3>

        {categoryData.length === 0 ? (
          <p>Add expense transactions to see breakdown</p>
        ) : (
          <PieChart width={400} height={300}>
            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {categoryData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={[
                    "#0088FE",
                    "#00C49F",
                    "#FFBB28",
                    "#FF8042",
                    "#AA336A",
                    "#8884d8",
                  ][index % 6]}
                />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        )}
      </div>
    </div>

  </div>
);
    
}