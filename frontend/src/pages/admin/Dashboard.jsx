import { useEffect, useState } from 'react';
import { dashboardService } from '../../services/dashboardService';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const res = await dashboardService.getOverview();
      setData(res.data);
    } catch (err) {
      console.error('Dashboard load failed', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div style={{ padding: 30 }}>Loading dashboard...</div>;
  }

  if (!data) {
    return <div style={{ padding: 30 }}>Failed to load dashboard</div>;
  }

  const { kpis, salesTrend, topProducts, lowStock } = data;

  /* normalize chart values */
  const maxSale = Math.max(...salesTrend.map(d => d.total), 1);

  return (
    <div className="dashboard">
      <style>{css}</style>

      {/* HEADER */}
      <div className="dash-header">
        <div>
          <h1>📊 Admin Dashboard</h1>
          <p>Business overview & insights</p>
        </div>
        <span className="date">{new Date().toDateString()}</span>
      </div>

      {/* KPI CARDS */}
      <div className="kpis">
        <div className="kpi users">
          <h4>Users</h4>
          <span>{kpis.users}</span>
        </div>
        <div className="kpi products">
          <h4>Products</h4>
          <span>{kpis.products}</span>
        </div>
        <div className="kpi customers">
          <h4>Customers</h4>
          <span>{kpis.customers}</span>
        </div>
        <div className="kpi sales">
          <h4>Total Sales</h4>
          <span>₹ {kpis.sales}</span>
        </div>
      </div>

      {/* SALES TREND */}
      <div className="card">
        <h3>📈 Sales – Last 7 Days</h3>
        <svg viewBox="0 0 300 100" className="chart">
          <polyline
            fill="none"
            stroke="#4f46e5"
            strokeWidth="3"
            points={salesTrend
              .map((d, i) => {
                const x = (i / (salesTrend.length - 1 || 1)) * 300;
                const y = 100 - (d.total / maxSale) * 90;
                return `${x},${y}`;
              })
              .join(' ')}
          />
        </svg>
      </div>

      {/* GRID */}
      <div className="grid">
        {/* TOP PRODUCTS */}
        <div className="card">
          <h3>🔥 Top Selling Products</h3>
          {topProducts.length === 0 ? (
            <p className="muted">No sales yet</p>
          ) : (
            topProducts.map(p => (
              <div key={p.name} className="row">
                <span>{p.name}</span>
                <strong>{p.qty}</strong>
              </div>
            ))
          )}
        </div>

        {/* LOW STOCK */}
        <div className="card danger">
          <h3>⚠️ Low Stock Alerts</h3>
          {lowStock.length === 0 ? (
            <p className="muted">All stock levels healthy ✅</p>
          ) : (
            lowStock.map(l => (
              <div key={l.name} className="row">
                <span>{l.name}</span>
                <strong>{l.stock_quantity}</strong>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================
   DASHBOARD CSS (INLINE)
========================= */
const css = `
.dashboard {
  background: #f5f7fb;
  min-height: 100vh;
  padding: 32px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont;
}

.dash-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.dash-header h1 {
  margin: 0;
  font-size: 28px;
}

.dash-header p {
  margin: 4px 0 0;
  color: #6b7280;
}

.date {
  background: #fff;
  padding: 10px 16px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0,0,0,.06);
}

.kpis {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.kpi {
  background: white;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,.08);
}

.kpi h4 {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
}

.kpi span {
  font-size: 26px;
  font-weight: 700;
}

.kpi.users { border-left: 5px solid #4f46e5; }
.kpi.products { border-left: 5px solid #10b981; }
.kpi.customers { border-left: 5px solid #0ea5e9; }
.kpi.sales { border-left: 5px solid #f59e0b; }

.card {
  background: white;
  margin-top: 24px;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,.08);
}

.card.danger {
  border-left: 6px solid #ef4444;
}

.chart {
  width: 100%;
  height: 140px;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px dashed #eee;
}

.row:last-child {
  border-bottom: none;
}

.muted {
  color: #6b7280;
}
`;
