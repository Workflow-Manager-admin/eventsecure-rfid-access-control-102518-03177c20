import React, { useState } from 'react';
import './App.css';

// PUBLIC_INTERFACE
function App() {
  // Track which main tab is active
  const [activeTab, setActiveTab] = useState('dashboard');
  // Track which subpanel (for admin) is active
  const [adminTab, setAdminTab] = useState('user-management');

  // PUBLIC_INTERFACE
  function Navbar() {
    return (
      <nav className="navbar" style={{ background: '#fff', borderBottom: '1px solid #e0e0e0', color: '#222' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="logo" style={{ color: '#1A237E', gap: 8 }}>
            <span className="logo-symbol" style={{ color: '#FF6F00', fontWeight: 800, fontSize: '1.7em' }}>★</span>
            <span style={{ fontWeight: 700, letterSpacing: 1 }}>EventSecure Access</span>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <button
              className={`btn${activeTab === 'dashboard' ? ' btn-active' : ''}`}
              style={tabBtnStyle(activeTab === 'dashboard')}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </button>
            <button
              className={`btn${activeTab === 'scan' ? ' btn-active' : ''}`}
              style={tabBtnStyle(activeTab === 'scan')}
              onClick={() => setActiveTab('scan')}
            >
              Scan
            </button>
            <button
              className={`btn${activeTab === 'admin' ? ' btn-active' : ''}`}
              style={tabBtnStyle(activeTab === 'admin')}
              onClick={() => setActiveTab('admin')}
            >
              Admin
            </button>
            <button
              className={`btn${activeTab === 'settings' ? ' btn-active' : ''}`}
              style={tabBtnStyle(activeTab === 'settings')}
              onClick={() => setActiveTab('settings')}
            >
              Settings
            </button>
          </div>
        </div>
      </nav>
    );
  }

  // Tab content render logic
  let mainContent = null;
  if (activeTab === 'dashboard') mainContent = <Dashboard />;
  else if (activeTab === 'scan') mainContent = <RFIDScan />;
  else if (activeTab === 'admin') mainContent = (
    <div className="admin-panels">
      <div style={{ borderBottom: "1px solid #eee", display: 'flex', gap: 8, marginBottom: 24 }}>
        <button className={`btn${adminTab === 'user-management' ? ' btn-active' : ''}`} style={tabBtnStyle(adminTab === 'user-management', true)} onClick={() => setAdminTab('user-management')}>Users</button>
        <button className={`btn${adminTab === 'logs' ? ' btn-active' : ''}`} style={tabBtnStyle(adminTab === 'logs', true)} onClick={() => setAdminTab('logs')}>Logs</button>
        <button className={`btn${adminTab === 'analytics' ? ' btn-active' : ''}`} style={tabBtnStyle(adminTab === 'analytics', true)} onClick={() => setAdminTab('analytics')}>Analytics</button>
        <button className={`btn${adminTab === 'export' ? ' btn-active' : ''}`} style={tabBtnStyle(adminTab === 'export', true)} onClick={() => setAdminTab('export')}>Export</button>
      </div>
      <div>
        {adminTab === 'user-management' && <UserManagement />}
        {adminTab === 'logs' && <LogReview />}
        {adminTab === 'analytics' && <AdminAnalytics />}
        {adminTab === 'export' && <ReportExport />}
      </div>
    </div>
  );
  else mainContent = <Settings />;

  return (
    <div className="app" style={{ background: '#f9fafe' }}>
      <Navbar />
      <main style={{ marginTop: 80 }}>
        <div className="container" style={{ minHeight: "76vh", paddingTop: 16, paddingBottom: 32 }}>
          {mainContent}
        </div>
      </main>
      <footer style={{
        background: '#fafbfc',
        borderTop: '1px solid #E3E3E3',
        color: '#333',
        fontSize: 13,
        textAlign: 'center',
        padding: '18px 0',
        marginTop: 32
      }}>
        © {new Date().getFullYear()} EventSecure | Powered by KAVIA
      </footer>
    </div>
  );
}

// ----- DASHBOARD -----
function Dashboard() {
  // Use state for dashboard stats (simulate update every 5s)
  const [stats, setStats] = React.useState({
    inside: 312,
    outside: 89,
    peakTime: "15:35",
    suspicious: 2,
    lastUpdate: new Date().toLocaleTimeString()
  });

  React.useEffect(() => {
    // Simulate automatic dashboard data update every 5 seconds
    const interval = setInterval(() => {
      setStats(prev => {
        // For demo purposes, randomize data slightly
        const insideRand = Math.max(0, prev.inside + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 5));
        const outsideRand = Math.max(0, prev.outside + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3));
        const suspiciousRand = Math.max(0, prev.suspicious + (Math.random() > 0.8 ? 1 : 0) - (Math.random() > 0.7 ? 1 : 0));
        return {
          inside: insideRand,
          outside: outsideRand,
          peakTime: prev.peakTime,
          suspicious: suspiciousRand,
          lastUpdate: new Date().toLocaleTimeString(),
        };
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1 style={mainTitleStyle}>Event Dashboard</h1>
      <div style={{ fontSize: 13, color: "#888", marginBottom: 2 }}>
        Last updated: <span style={{ color: "#1A237E", fontWeight: 600 }}>{stats.lastUpdate}</span>
      </div>
      <div className="dashboard-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 32,
        margin: '32px 0'
      }}>
        <StatCard title="Attendees Inside" value={stats.inside} icon="🟢" color="#1A237E" textColor="#1A237E" />
        <StatCard title="Attendees Outside" value={stats.outside} icon="🔵" color="#FF6F00" textColor="#FF6F00" />
        <StatCard title="Peak Time" value={stats.peakTime} icon="⏰" color="#E87A41" textColor="#E87A41" />
        <StatCard title="Suspicious Scans" value={stats.suspicious} icon="⚠️" color="#C62828" textColor="#C62828" />
      </div>
      <div style={{ marginTop: 32, display: 'flex', gap: 40, flexWrap: 'wrap' }}>
        <FlowGraph />
        <HourlyStats />
      </div>
    </div>
  );
}

// ----- RFID SCANNING -----
function RFIDScan() {
  const [scanState, setScanState] = useState(null);

  // Simulate scan result with a button for demonstration
  function handleTestScan() {
    // RANDOM result
    const res = Math.random();
    if (res < 0.6) setScanState({status: "success", name: "Ashley Smith", photo: "/user.jpg", direction: "IN"});
    else if (res < 0.85) setScanState({status: "duplicate", name: "Ashley Smith", photo: "/user.jpg", direction: "IN"});
    else setScanState({status: "invalid"});
    setTimeout(() => setScanState(null), 3500);
  }

  return (
    <section>
      <h1 style={mainTitleStyle}>RFID Gate Scanning</h1>
      <div style={{ maxWidth: 470, margin: "0 auto", background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px 0 #1A237E14", padding: 28, textAlign: 'center' }}>
        <p>Present RFID card to the reader. Confirmation, alerts, and visual verification will appear below.</p>
        <button className="btn btn-large" onClick={handleTestScan} style={{ margin: '12px 0' }}>Simulate Card Scan</button>
        <div style={{ margin: '28px auto', minHeight: 90 }}>
          {!scanState && <span style={{ color: '#aaa' }}>Awaiting scan...</span>}
          {scanState && scanState.status === "success" && (
            <div>
              <span style={{ color: "#238B36", fontWeight: 600, fontSize: 18 }}>IN recorded - Welcome, {scanState.name}!</span>
              <UserPhoto />
            </div>
          )}
          {scanState && scanState.status === "duplicate" && (
            <div>
              <span style={{ color: "#FF6F00", fontWeight: 600, fontSize: 18 }}>Duplicate Entry: Already IN!</span>
              <UserPhoto />
            </div>
          )}
          {scanState && scanState.status === "invalid" && (
            <span style={{ color: "#C62828", fontWeight: 600, fontSize: 18 }}>Invalid Card! Access Denied.</span>
          )}
        </div>
        <p style={{ fontSize: 13, color: "#888" }}>Sound/vibration alerts provided on error.<br />Photo display (optional) for visual verification.</p>
      </div>
    </section>
  );
}

// ----- USER MANAGEMENT -----
function UserManagement() {
  // Demo table of users for participant management
  return (
    <div>
      <h2 style={sectionTitleStyle}>Participant Management</h2>
      <div style={{
        background: '#fff', padding: 22, borderRadius: 10, boxShadow: "0 2px 8px #E3E3E355",
        marginBottom: 16, maxWidth: 780
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <button className="btn" style={{ background: "#FF6F00", color: "#fff", marginRight: 4 }}>+ Add User</button>
            <button className="btn" style={{ background: "#E87A41", color: "#fff" }}>Import CSV</button>
          </div>
          <div>
            <input
              style={{ border: "1px solid #e0e0e0", padding: "8px 10px", borderRadius: 5, fontSize: 14 }}
              placeholder="Search users..."
            />
          </div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
          <thead>
            <tr style={{ background: '#e3e3e3' }}>
              <th>ID</th>
              <th>Name</th>
              <th>RFID</th>
              <th>Status</th>
              <th>Last IN</th>
              <th>Zone</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>102843</td>
              <td>Ashley Smith</td>
              <td>RF1ACD97</td>
              <td style={{ color: "#238B36", fontWeight: 500 }}>IN</td>
              <td>15:41</td>
              <td>North Gate</td>
              <td><button className="btn" style={{ fontSize: 12, padding: "6px 12px" }}>Edit</button></td>
            </tr>
            <tr>
              <td>105992</td>
              <td>Li Wang</td>
              <td>RF695EC7</td>
              <td style={{ color: "#C62828", fontWeight: 500 }}>OUT</td>
              <td>13:07</td>
              <td>South Gate</td>
              <td><button className="btn" style={{ fontSize: 12, padding: "6px 12px" }}>Edit</button></td>
            </tr>
            <tr style={{ backgroundColor: "#fff7e0" }}>
              <td>104543</td>
              <td>Harjit Patel</td>
              <td>RFAAE812</td>
              <td style={{ color: "#FF6F00", fontWeight: 500 }}>Suspicious</td>
              <td>15:43</td>
              <td>East Gate</td>
              <td><button className="btn" style={{ fontSize: 12, padding: "6px 12px" }}>Review</button></td>
            </tr>
          </tbody>
        </table>
      </div>
      <p style={{ color: "#777", fontSize: 13 }}>Admins can add/import participants, assign RFID codes, and review analytics.</p>
    </div>
  );
}

// ----- LOG REVIEW -----
function LogReview() {
  return (
    <div>
      <h2 style={sectionTitleStyle}>Scan & Entry Logs</h2>
      <div style={{
        background: '#fff', padding: 18, borderRadius: 10, boxShadow: "0 2px 8px #E3E3E355",
        marginBottom: 16, maxWidth: 780
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}>
          <thead>
            <tr style={{ background: '#e3e3e3' }}>
              <th>Time</th>
              <th>User</th>
              <th>RFID</th>
              <th>Zone</th>
              <th>Status</th>
              <th>Device</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>15:50:09</td>
              <td>Ashley Smith</td>
              <td>RF1ACD97</td>
              <td>North Gate</td>
              <td style={{ color: "#238B36" }}>IN</td>
              <td>Reader#03</td>
              <td>Photo match</td>
            </tr>
            <tr>
              <td>15:43:17</td>
              <td>Harjit Patel</td>
              <td>RFAAE812</td>
              <td>East Gate</td>
              <td style={{ color: "#FF6F00" }}>Duplicate IN</td>
              <td>Reader#01</td>
              <td style={{ color: "#FF6F00" }}>Flagged: Buddy punch attempt</td>
            </tr>
            <tr>
              <td>13:07:50</td>
              <td>Li Wang</td>
              <td>RF695EC7</td>
              <td>South Gate</td>
              <td style={{ color: "#C62828" }}>OUT</td>
              <td>Reader#02</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
      <p style={{ color: "#777", fontSize: 13 }}>System logs record every scan with timestamp, device, and status. Suspicious activity is flagged for admin review.</p>
    </div>
  );
}

// ----- ADMIN ANALYTICS -----
function AdminAnalytics() {
  return (
    <div>
      <h2 style={sectionTitleStyle}>Entry Analytics</h2>
      <FlowGraph />
      <HourlyStats />
    </div>
  );
}

// ----- REPORT EXPORT -----
function ReportExport() {
  return (
    <div>
      <h2 style={sectionTitleStyle}>Export Attendance Data</h2>
      <div style={{
        background: '#fff', padding: 22, borderRadius: 10, boxShadow: "0 2px 8px #E3E3E355",
        marginBottom: 16, maxWidth: 480
      }}>
        <p>Export all attendance, logs, and analytics to CSV or Excel for external reporting.</p>
        <button className="btn btn-large" style={{ background: "#1A237E", color: "#fff", marginRight: 10 }}>Export as CSV</button>
        <button className="btn btn-large" style={{ background: "#E87A41", color: "#fff" }}>Export as Excel</button>
      </div>
      <p style={{ color: "#777", fontSize: 13 }}>Download options allow event admins to save reports for compliance/auditing.</p>
    </div>
  );
}

// ----- SETTINGS (System Configuration) -----
function Settings() {
  // Simulated details for system config
  return (
    <div>
      <h1 style={mainTitleStyle}>System Configuration</h1>
      <div style={{ background: "#fff", borderRadius: 14, padding: 28, boxShadow: "0 2px 14px 0 #1A237E0c", maxWidth: 630 }}>
        <h3 style={{ color: "#1A237E" }}>Zones & Gates</h3>
        <table style={{ width: "100%", marginBottom: 14 }}>
          <thead><tr>
            <th>Name</th><th>Type</th><th>Assigned Devices</th><th></th>
          </tr></thead>
          <tbody>
            <tr>
              <td>North Gate</td>
              <td>IN/OUT</td>
              <td>Reader#03</td>
              <td><button className="btn" style={{ fontSize: 12 }}>Edit</button></td>
            </tr>
            <tr>
              <td>South Gate</td>
              <td>IN/OUT</td>
              <td>Reader#02</td>
              <td><button className="btn" style={{ fontSize: 12 }}>Edit</button></td>
            </tr>
          </tbody>
        </table>
        <button className="btn" style={{ background: "#FF6F00", color: "#fff" }}>Add Zone</button>
        <h3 style={{ marginTop: 28, color: "#1A237E" }}>RFID Device Integration</h3>
        <ul style={{ fontSize: 15, color: "#333" }}>
          <li>
            Supported: <span style={{ color: "#238B36" }}>uFR Classic, ACR122U, PN532</span>
          </li>
          <li>
            Cloud / Local Sync: Enabled
          </li>
          <li>
            Last sync: <span style={{ color: "#888" }}>2 min ago</span>
          </li>
        </ul>
      </div>
      <p style={{ color: "#777", fontSize: 13, marginTop: 6 }}>Add/edit zones, assign devices, and synchronize system details for robust operations.</p>
    </div>
  );
}

// ----- UI ATOMS -----
function StatCard({ icon, color, title, value, textColor }) {
  // Use a dark color when supplied color is light
  function getContrastColor(hex) {
    // fallback for non-hex inputs
    if (!hex || typeof hex !== 'string') return "#1A237E";
    let c = hex.replace("#", "");
    if (c.length === 3) c = c.split("").map(x => x + x).join("");
    const rgb = parseInt(c, 16);
    const r = (rgb >> 16) & 0xff, g = (rgb >> 8) & 0xff, b = rgb & 0xff;
    // Luminance formula
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance > 180 ? "#222" : "#fff";
  }

  // If textColor provided, use it for number, choose correct contrasting color for value background
  const valueStyle = {
    fontSize: 26,
    fontWeight: 700,
    color: textColor || getContrastColor(color),
    marginTop: 6,
    textShadow: "0 1px 2px rgb(0 0 0 / 8%)"
  };

  return (
    <div style={{
      background: "#fff",
      borderRadius: 12,
      padding: "22px 18px",
      minWidth: 185,
      minHeight: 90,
      boxShadow: "0 2px 12px 0 #1A237E18",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      borderTop: `5px solid ${color}`,
      marginBottom: 6
    }}>
      <span style={{ fontSize: 32 }}>{icon}</span>
      <span style={valueStyle}>{value}</span>
      <span style={{ color: "#222", fontWeight: 500, marginTop: 4 }}>{title}</span>
    </div>
  );
}
function FlowGraph() {
  // Demo: show static flow
  return (
    <div style={{
      background: "#fff", borderRadius: 12, boxShadow: "0 1px 8px #E3E3E355", padding: 18,
      minWidth: 340, minHeight: 206, flex: 1
    }}>
      <strong>IN/OUT Flow (Last Hour)</strong>
      <svg width="99%" height="100" style={{ marginTop: 14, marginBottom: 8 }}>
        {/* Simple bar chart */}
        <rect x="20" y="52" width="18" height="36" fill="#1A237E" />
        <rect x="50" y="32" width="18" height="56" fill="#1A237E" />
        <rect x="80" y="22" width="18" height="66" fill="#FF6F00" />
        <rect x="120" y="44" width="18" height="44" fill="#1A237E" />
        <rect x="150" y="68" width="18" height="20" fill="#FF6F00" />
        <rect x="180" y="28" width="18" height="60" fill="#1A237E" />
      </svg>
      <div style={{ fontSize: 13, color: "#888" }}>
        Blue = IN | Orange = OUT
      </div>
    </div>
  );
}
function HourlyStats() {
  // Demo: show static stats
  return (
    <div style={{
      background: "#fff", borderRadius: 12, boxShadow: "0 1px 8px #E3E3E355", padding: 18,
      minWidth: 200, maxWidth: 260, minHeight: 206, flex: 1
    }}>
      <strong>Hourly Stats</strong>
      <table style={{ width: "100%", fontSize: 14, marginTop: 14 }}>
        <tbody>
          <tr>
            <td>14:00</td>
            <td align="right">38</td>
          </tr>
          <tr>
            <td>15:00</td>
            <td align="right">60</td>
          </tr>
          <tr>
            <td>16:00</td>
            <td align="right">68</td>
          </tr>
          <tr>
            <td>Peak</td>
            <td align="right" style={{ fontWeight: 600, color: "#FF6F00" }}>86</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
function UserPhoto() {
  return (
    <div style={{
      width: 68,
      height: 68,
      borderRadius: "50%",
      margin: "12px auto",
      background: "#eee",
      overflow: "hidden",
      border: "2px solid #1A237E"
    }}>
      {/* Demo avatar */}
      <img
        src="https://randomuser.me/api/portraits/men/36.jpg"
        alt="User"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
}

// ----- STYLES -----
const mainTitleStyle = {
  fontSize: 30,
  color: "#1A237E",
  fontWeight: 700,
  margin: "28px 0 10px 0"
};
const sectionTitleStyle = {
  fontSize: 22,
  color: "#1A237E",
  fontWeight: 700,
  margin: "22px 0 18px 0"
};

function tabBtnStyle(active, isSub = false) {
  return {
    background: active ? (isSub ? "#f9e9d1" : "#1A237E") : (isSub ? "#fff" : "#e3e3e3"),
    color: active ? (isSub ? "#FF6F00" : "#fff") : "#222",
    border: active ? (isSub ? "1.5px solid #FF6F00" : "none") : "none",
    fontWeight: active ? 600 : 400,
    fontSize: 16,
    borderRadius: 6,
    marginRight: 2,
    padding: isSub ? "8px 18px" : "9px 22px",
    boxShadow: active && !isSub ? "0 2px 6px #1A237E19" : "",
    cursor: "pointer"
  };
}

export default App;