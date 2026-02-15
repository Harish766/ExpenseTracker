import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto'; 

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [chartData, setChartData] = useState(null);
  
  const [formData, setFormData] = useState({ title: '', amount: '', category: 'Food', type: 'expense' });

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
      const expRes = await axios.get('http://localhost:5000/api/expenses', config);
      setExpenses(expRes.data.data);

      const sumRes = await axios.get('http://localhost:5000/api/expenses/summary/monthly', config);
      setSummary(sumRes.data);

      const catRes = await axios.get('http://localhost:5000/api/expenses/summary/category', config);
      const categories = catRes.data.data.map(item => item.category);
      const values = catRes.data.data.map(item => item.total);
      
      setChartData({
        labels: categories,
        datasets: [{
          data: values,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        }]
      });
    } catch (err) {
      console.error("Error fetching data", err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5000/api/expenses', { ...formData, date: new Date() }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData(); 
      setFormData({ title: '', amount: '', category: 'Food', type: 'expense' }); 
    } catch (err) {
      alert("Error adding expense");
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/expenses/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      alert("Error deleting expense");
    }
  };

  return (
    <div className="dashboard">
      <h1 style={{ marginBottom: '20px' }}>My Finance Dashboard</h1>
      
      <div className="summary-cards">
        <div className="card income">Income: ${summary.totalIncome}</div>
        <div className="card expense">Expense: ${summary.totalExpense}</div>
        <div className="card balance">Balance: ${summary.balance}</div>
      </div>

      <div className="content-grid">
        <div className="form-section">
          <h3>Add Transaction</h3>
          <form onSubmit={handleAddExpense}>
            <input 
              type="text" placeholder="Title" value={formData.title} required
              onChange={e => setFormData({...formData, title: e.target.value})}  
            />
            <input 
              type="number" placeholder="Amount" value={formData.amount} required
              onChange={e => setFormData({...formData, amount: e.target.value})}  
            />
            <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Salary">Salary</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Utilities">Utilities</option>
            </select>
            <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <button type="submit">Add</button>
          </form>
        </div>

        <div className="list-section">
          <h3>Recent Transactions</h3>
          <ul style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {expenses.map(exp => (
              <li key={exp._id} className={exp.type}>
                <span><strong>{exp.title}</strong> <br/><small>{exp.category}</small></span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span style={{ fontWeight: 'bold' }}>${exp.amount}</span>
                  <button onClick={() => handleDelete(exp._id)} style={{ background: '#e74c3c', padding: '5px 10px' }}>X</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="chart-section">
          <h3>Spending Breakdown</h3>
          {chartData && chartData.labels.length > 0 ? (
            <Pie data={chartData} />
          ) : (
            <p style={{ color: '#7f8c8d' }}>Add some expenses to see the chart!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;