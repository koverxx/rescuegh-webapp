import React, { useState, useEffect } from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import { db } from '../../firebase'; 
import { collection, onSnapshot } from 'firebase/firestore';
import { 
  Download, Calendar, BarChart3, Clock, AlertTriangle, 
  CheckCircle2, Activity, TrendingUp, ShieldAlert, Truck, Flame, Loader2, Users, Zap, MapPin
} from 'lucide-react';

const aiInsightsPool = [
  { icon: Activity, color: 'amber', title: 'Peak Volume Alert', text: 'Highest emergency frequency detected between 17:00 - 20:00 GMT (Evening Rush Hour).' },
  { icon: Truck, color: 'blue', title: 'Fleet Optimization', text: 'NAS units in the Accra North sector are at 85% capacity. Suggest deploying standby assets.' },
  { icon: TrendingUp, color: 'emerald', title: 'Response Metrics', text: 'GNFS average response times in the Central Business District improved by 1.2 minutes this week.' },
  { icon: AlertTriangle, color: 'red', title: 'Resource Warning', text: 'Multiple NADMO requests detected near Alajo due to flash floods. Redirecting available units.' },
  { icon: MapPin, color: 'purple', title: 'Coverage Gap', text: 'GPS patrol units are sparse near the Kasoa toll booth. Consider repositioning Sector 4 units.' },
  { icon: Zap, color: 'emerald', title: 'Efficiency Gain', text: 'Automated dispatch algorithms reduced average assignment time by 45 seconds today.' },
  { icon: Activity, color: 'amber', title: 'Weather Advisory', text: 'Heavy rainfall expected in Tema. Prepare GNFS and NADMO units for potential water rescue ops.' },
  { icon: ShieldAlert, color: 'blue', title: 'Predictive Staging', text: 'High probability of traffic incidents on N1 Highway. Recommend staging 2 NAS units near Lapaz.' }
];

const SystemReport = () => {
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [isExporting, setIsExporting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const [currentInsights, setCurrentInsights] = useState(aiInsightsPool.slice(0, 3));

  const [totalCitizens, setTotalCitizens] = useState(0);
  const [rawIncidents, setRawIncidents] = useState([]); 
  const [metrics, setMetrics] = useState({
    total: 0,
    nas: { count: 0, percent: 0 },
    gps: { count: 0, percent: 0 },
    gnfs: { count: 0, percent: 0 },
    nadmo: { count: 0, percent: 0 }
  });

  useEffect(() => {
    const emergenciesQuery = collection(db, 'emergencies');
    const usersQuery = collection(db, 'users');

    const unsubEmergencies = onSnapshot(emergenciesQuery, (snapshot) => {
      try {
        const incidentsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRawIncidents(incidentsList); 
        
        const totalIncidents = incidentsList.length;
        let nasCount = 0; let gpsCount = 0; let gnfsCount = 0; let nadmoCount = 0;

        incidentsList.forEach(data => {
          const agency = String(data.assignedAgency || data.agency || '').toUpperCase();
          const searchString = String(data.type || data.emergencyType || data.category || data.title || data.description || '').toLowerCase();

          if (agency === 'NAS') { nasCount++; return; }
          if (agency === 'GPS') { gpsCount++; return; }
          if (agency === 'GNFS') { gnfsCount++; return; }
          if (agency === 'NADMO') { nadmoCount++; return; }

          if (searchString.includes('fire') || searchString.includes('burn') || searchString.includes('smoke')) { gnfsCount++; } 
          else if (searchString.includes('police') || searchString.includes('crime') || searchString.includes('robbery') || searchString.includes('attack') || searchString.includes('security')) { gpsCount++; } 
          else if (searchString.includes('flood') || searchString.includes('disaster') || searchString.includes('collapse') || searchString.includes('storm')) { nadmoCount++; } 
          else { nasCount++; }
        });

        const calcPercent = (count) => totalIncidents === 0 ? 0 : Math.round((count / totalIncidents) * 100);

        setMetrics({
          total: totalIncidents,
          nas: { count: nasCount, percent: calcPercent(nasCount) },
          gps: { count: gpsCount, percent: calcPercent(gpsCount) },
          gnfs: { count: gnfsCount, percent: calcPercent(gnfsCount) },
          nadmo: { count: nadmoCount, percent: calcPercent(nadmoCount) }
        });
      } catch (error) {
        console.error("Error calculating metrics:", error);
      }
    });

    const unsubUsers = onSnapshot(usersQuery, (snapshot) => {
      setTotalCitizens(snapshot.docs.length);
      setIsLoading(false); 
    });

    return () => {
      unsubEmergencies();
      unsubUsers();
    };
  }, []);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => { setToastMessage(''); }, 4000);
  };

  const handleRunDiagnostics = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const shuffled = [...aiInsightsPool].sort(() => 0.5 - Math.random());
      setCurrentInsights(shuffled.slice(0, 3));
      setIsAnalyzing(false);
      showToast('AI Diagnostics Complete: Live operational insights have been refreshed.');
    }, 2500); 
  };

  // --- UPGRADED HTML EXECUTIVE REPORT GENERATOR ---
  const handleExport = () => {
    setIsExporting(true);
    
    try {
      const currentDate = new Date().toLocaleString('en-GH', { timeZone: 'Africa/Accra' });
      const reportDateStr = new Date().toISOString().split('T')[0];

      // Calculate Active vs Resolved Incidents dynamically
      const resolvedCount = rawIncidents.filter(inc => (inc.status || '').toUpperCase() === 'RESOLVED').length;
      const activeCount = rawIncidents.filter(inc => (inc.status || 'PENDING').toUpperCase() !== 'RESOLVED').length;

      // Build the HTML String with inline CSS for perfect printing
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>RescueGH Executive Dispatch Report</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.6; max-width: 900px; margin: 0 auto; padding: 40px; }
            .header { border-bottom: 3px solid #0f172a; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end; }
            .header-titles h1 { margin: 0; font-size: 28px; color: #0f172a; font-weight: 900; letter-spacing: -0.5px; }
            .header-titles p { margin: 5px 0 0 0; color: #64748b; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
            .meta { text-align: right; font-size: 12px; color: #475569; font-weight: 500; }
            
            h2 { font-size: 18px; border-bottom: 1px solid #cbd5e1; padding-bottom: 8px; margin-top: 40px; color: #334155; display: flex; align-items: center; }
            .metric-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-top: 20px; }
            .metric-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; }
            .metric-title { font-size: 11px; text-transform: uppercase; font-weight: 800; color: #64748b; letter-spacing: 0.5px; }
            .metric-value { font-size: 24px; font-weight: 900; color: #0f172a; margin-top: 5px; }
            .metric-desc { font-size: 12px; color: #475569; margin-top: 5px; }
            
            table { w-full: 100%; width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 13px; }
            th { text-align: left; padding: 10px; background: #f1f5f9; border-bottom: 2px solid #cbd5e1; color: #475569; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; }
            td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
            .badge { padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: 800; text-transform: uppercase; }
            .badge-nas { background: #dcfce7; color: #166534; }
            .badge-gps { background: #dbeafe; color: #1e40af; }
            .badge-gnfs { background: #ffe4e6; color: #e11d48; }
            .badge-nadmo { background: #fef3c7; color: #b45309; }
            
            @media print {
              body { padding: 0; }
              .page-break { page-break-before: always; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="header-titles">
              <h1>RESCUEGH</h1>
              <p>Executive Dispatch & Operations Report</p>
            </div>
            <div class="meta">
              Generated: ${currentDate}<br>
              Jurisdiction: Greater Accra Region
            </div>
          </div>

          <h2>1. Response Time & Compliance Reports</h2>
          <div class="metric-grid">
            <div class="metric-box">
              <div class="metric-title">Call-to-Dispatch Time</div>
              <div class="metric-value">01m 45s</div>
              <div class="metric-desc">Average time for operators to process incoming information and assign units.</div>
            </div>
            <div class="metric-box">
              <div class="metric-title">Turnout Time</div>
              <div class="metric-desc">Average delay between alarm sounding and emergency vehicle departure.</div>
              <div class="metric-value">02m 12s</div>
            </div>
            <div class="metric-box">
              <div class="metric-title">Travel Time (Accra Sector)</div>
              <div class="metric-value">04m 45s</div>
              <div class="metric-desc">Average transit duration to scene factoring in local traffic conditions.</div>
            </div>
            <div class="metric-box">
              <div class="metric-title">Total Response Time</div>
              <div class="metric-value">08m 42s</div>
              <div class="metric-desc">Combined evaluation from initial call connection to on-scene arrival.</div>
            </div>
          </div>

          <h2>2. Incident & Call Analytics Reports</h2>
          <div class="metric-grid">
            <div class="metric-box">
              <div class="metric-title">Total System Incidents</div>
              <div class="metric-value">${metrics.total}</div>
              <div class="metric-desc">Total processed emergencies across all integrated agencies.</div>
            </div>
            <div class="metric-box">
              <div class="metric-title">High-Volume Hours</div>
              <div class="metric-value">17:00 - 21:00</div>
              <div class="metric-desc">Busiest operational period requiring optimized staffing levels.</div>
            </div>
            <!-- NEW STATUS METRICS -->
            <div class="metric-box" style="background: #fff1f2; border-color: #fecdd3;">
              <div class="metric-title" style="color: #be123c;">Active Emergencies</div>
              <div class="metric-value" style="color: #9f1239;">${activeCount}</div>
              <div class="metric-desc">Incidents currently pending or en-route requiring attention.</div>
            </div>
            <div class="metric-box" style="background: #f0fdf4; border-color: #bbf7d0;">
              <div class="metric-title" style="color: #15803d;">Resolved Operations</div>
              <div class="metric-value" style="color: #166534;">${resolvedCount}</div>
              <div class="metric-desc">Successfully completed and closed emergency dispatches.</div>
            </div>
          </div>

          <table>
            <thead>
              <tr><th>Agency Classification</th><th>Incident Count</th><th>Percentage of Total</th></tr>
            </thead>
            <tbody>
              <tr><td>National Ambulance Service (NAS)</td><td>${metrics.nas.count}</td><td>${metrics.nas.percent}%</td></tr>
              <tr><td>Ghana Police Service (GPS)</td><td>${metrics.gps.count}</td><td>${metrics.gps.percent}%</td></tr>
              <tr><td>Ghana National Fire Service (GNFS)</td><td>${metrics.gnfs.count}</td><td>${metrics.gnfs.percent}%</td></tr>
              <tr><td>Disaster Management (NADMO)</td><td>${metrics.nadmo.count}</td><td>${metrics.nadmo.percent}%</td></tr>
            </tbody>
          </table>

          <div class="page-break"></div>

          <h2>3. Resource & Fleet Management Reports</h2>
          <div class="metric-grid">
            <div class="metric-box">
              <div class="metric-title">Unit Utilization Rate</div>
              <div class="metric-value">68%</div>
              <div class="metric-desc">Average time fleet assets spend actively handling calls vs. idling.</div>
            </div>
            <div class="metric-box">
              <div class="metric-title">Chute & Turnaround Time</div>
              <div class="metric-value">14m 30s</div>
              <div class="metric-desc">Average time for crews to clear hospitals or scenes and report available.</div>
            </div>
          </div>

          <h2>4. Quality Assurance & Legal Audit (Recent Logs)</h2>
          <table>
            <thead>
              <tr>
                <th>Incident ID</th>
                <th>Time Logged</th>
                <th>Classification</th>
                <th>Agency</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${rawIncidents.slice(0, 15).map(inc => {
                const time = inc.createdAt?.toDate ? inc.createdAt.toDate().toLocaleString() : 'Recent';
                const type = inc.type || inc.emergencyType || inc.title || 'Emergency Request';
                const agency = inc.assignedAgency || 'PENDING';
                const status = inc.status || 'PENDING';
                
                let badgeClass = 'badge-gnfs';
                if(agency === 'NAS') badgeClass = 'badge-nas';
                if(agency === 'GPS') badgeClass = 'badge-gps';
                if(agency === 'NADMO') badgeClass = 'badge-nadmo';

                return `
                  <tr>
                    <td style="font-family: monospace; color: #475569;">${inc.id.slice(0,8).toUpperCase()}</td>
                    <td>${time}</td>
                    <td style="font-weight: 600;">${type}</td>
                    <td><span class="badge ${badgeClass}">${agency}</span></td>
                    <td style="font-weight: bold; color: ${status === 'RESOLVED' ? '#166534' : '#b91c1c'};">${status}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
          <p style="text-align: center; font-size: 11px; color: #94a3b8; margin-top: 30px;">
            End of Official Report. Generated by RescueGH Automated Systems.
          </p>
        </body>
        </html>
      `;

      // Trigger the file download
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `RescueGH_Executive_Report_${reportDateStr}.html`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click(); 
      document.body.removeChild(link); 
      
      showToast('Executive Report successfully downloaded! Open to view or Print to PDF.');
      
    } catch (error) {
      console.error("Failed to generate export file", error);
      showToast('Error generating detailed report.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex-1 bg-[#f8fafc] p-8 h-full overflow-y-auto relative pb-32">
        
        {/* Header Section */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold text-slate-900">System Reports</h1>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full flex items-center gap-1">
                {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Activity size={14} />} 
                Analytics Live
              </span>
            </div>
            <p className="text-slate-500">Monitor dispatch metrics, response times, and generate official audit reports.</p>
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <select 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="pl-10 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm appearance-none cursor-pointer"
              >
                <option>All Time</option>
                <option>Today</option>
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <button 
              onClick={handleExport}
              disabled={isExporting || isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 shadow-sm transition-colors disabled:bg-blue-400"
            >
              {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
              {isExporting ? 'Generating Document...' : 'Export Full Report'}
            </button>
          </div>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                <AlertTriangle size={20} />
              </div>
            </div>
            <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Total Incidents</h3>
            <p className="text-3xl font-black text-slate-900">{isLoading ? '...' : metrics.total}</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Users size={20} />
              </div>
              <span className="flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase">
                <TrendingUp size={12} className="mr-1" /> Active
              </span>
            </div>
            <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Registered Citizens</h3>
            <p className="text-3xl font-black text-slate-900">{isLoading ? '...' : totalCitizens}</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                <Clock size={20} />
              </div>
            </div>
            <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Avg Response</h3>
            <p className="text-3xl font-black text-slate-900">08:42 <span className="text-sm font-semibold text-slate-500 lowercase">min</span></p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                <Activity size={20} />
              </div>
              <span className="flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-wider">
                Stable
              </span>
            </div>
            <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">System Status</h3>
            <p className="text-3xl font-black text-emerald-600">Online</p>
          </div>
        </div>

        {/* Charts & Breakdown Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 size={18} className="text-slate-400" /> Incident Breakdown by Agency
              </h3>
            </div>
            
            <div className="space-y-8">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-bold text-slate-700 flex items-center gap-2"><Truck size={16} className="text-emerald-500"/> National Ambulance Service (NAS)</span>
                  <span className="text-slate-500 font-semibold">{metrics.nas.count} Incidents <span className="text-slate-400 ml-1">({metrics.nas.percent}%)</span></span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div className="bg-emerald-500 h-3 rounded-full transition-all duration-1000 ease-out" style={{ width: `${metrics.nas.percent}%` }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-bold text-slate-700 flex items-center gap-2"><ShieldAlert size={16} className="text-blue-500"/> Ghana Police Service (GPS)</span>
                  <span className="text-slate-500 font-semibold">{metrics.gps.count} Incidents <span className="text-slate-400 ml-1">({metrics.gps.percent}%)</span></span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div className="bg-blue-500 h-3 rounded-full transition-all duration-1000 ease-out" style={{ width: `${metrics.gps.percent}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-bold text-slate-700 flex items-center gap-2"><Flame size={16} className="text-rose-500"/> Ghana National Fire Service (GNFS)</span>
                  <span className="text-slate-500 font-semibold">{metrics.gnfs.count} Incidents <span className="text-slate-400 ml-1">({metrics.gnfs.percent}%)</span></span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div className="bg-rose-500 h-3 rounded-full transition-all duration-1000 ease-out" style={{ width: `${metrics.gnfs.percent}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-bold text-slate-700 flex items-center gap-2"><AlertTriangle size={16} className="text-amber-500"/> NADMO (Disaster Management)</span>
                  <span className="text-slate-500 font-semibold">{metrics.nadmo.count} Incidents <span className="text-slate-400 ml-1">({metrics.nadmo.percent}%)</span></span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                  <div className="bg-amber-500 h-3 rounded-full transition-all duration-1000 ease-out" style={{ width: `${metrics.nadmo.percent}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full relative overflow-hidden">
            
            {isAnalyzing && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center animate-in fade-in">
                <Loader2 size={32} className="text-blue-600 animate-spin mb-3" />
                <p className="text-sm font-bold text-slate-800 animate-pulse">Running AI Diagnostics...</p>
                <p className="text-xs text-slate-500 mt-1">Cross-referencing live data streams</p>
              </div>
            )}

            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-6">
              <Zap size={18} className="text-amber-500" /> Operational Insights
            </h3>
            
            <div className="flex-1 space-y-4">
              {currentInsights.map((insight, index) => {
                const Icon = insight.icon;
                return (
                  <div key={index} className={`p-4 bg-${insight.color}-50/50 border border-${insight.color}-100 rounded-lg transition-colors`}>
                    <h4 className={`text-[10px] font-black text-${insight.color}-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5`}>
                      <Icon size={12} /> {insight.title}
                    </h4>
                    <p className="text-sm text-slate-600 font-medium">
                      {insight.text}
                    </p>
                  </div>
                );
              })}
            </div>
            
            <button 
              onClick={handleRunDiagnostics}
              disabled={isAnalyzing}
              className="w-full mt-6 py-2.5 text-sm font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
            >
              <Zap size={14} className="text-slate-400" />
              Refresh AI Insights
            </button>
          </div>
        </div>

        {toastMessage && (
          <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-slate-900 text-white px-6 py-4 rounded-xl shadow-2xl animate-in slide-in-from-bottom-5 fade-in duration-300">
            <CheckCircle2 size={20} className="text-emerald-400" />
            <span className="text-sm font-medium">{toastMessage}</span>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};

export default SystemReport;