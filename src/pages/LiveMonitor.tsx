import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck,
  Plus,
  Video,
  WifiOff,
  Activity,
  UserPlus,
  Bell,
  AlertTriangle,
  MapPin,
  Clock,
  CheckCircle,
  Loader2
} from 'lucide-react';
import io from 'socket.io-client';

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
const now = () => new Date().toLocaleTimeString();

const sampleReasons = ['Sports Competition', 'Medical', 'Library Duty', 'Lab Prep', 'Placement Event'];

function statusStyles(status) {
  switch (status) {
    case 'Bunking': return { border: 'border-red-500/90', bg: 'bg-red-500/10', text: 'text-red-300' };
    case 'Authorized': return { border: 'border-green-500/90', bg: 'bg-green-500/10', text: 'text-green-300' };
    case 'In Class': return { border: 'border-blue-500/90', bg: 'bg-blue-500/10', text: 'text-blue-300' };
    default: return { border: 'border-gray-500', bg: 'bg-gray-500/10', text: 'text-gray-300' };
  }
}

function LiveMonitor() {
  const [detections, setDetections] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [exemptions, setExemptions] = useState([]);
  const [search, setSearch] = useState('');
  const [newExName, setNewExName] = useState('');
  const [newExReason, setNewExReason] = useState('');
  const [socket, setSocket] = useState(null);
  const [videoConnected, setVideoConnected] = useState(false);

  const filteredExemptions = useMemo(() =>
    exemptions.filter(e => (e.student_name || e.name).toLowerCase().includes(search.toLowerCase()) ||
      e.reason.toLowerCase().includes(search.toLowerCase())),
    [exemptions, search]
  );

  const [classes, setClasses] = useState([
    { name: 'CS101', expected: 60, current: 54 },
    { name: 'EE207', expected: 45, current: 42 },
    { name: 'MA110', expected: 50, current: 48 },
    { name: 'BIO150', expected: 40, current: 36 }
  ]);

  // Connect to backend
  useEffect(() => {
    const s = io();
    setSocket(s);

    s.on('connect', () => {
      console.log('[SocketIO] Connected to backend');
      setVideoConnected(true);
    });

    s.on('disconnect', () => {
      console.log('[SocketIO] Disconnected from backend');
      setVideoConnected(false);
    });

    s.on('detections_update', (data) => {
      console.log('[Detection]', data);
      const receivedDetections = data.detections;

      // Process detections
      receivedDetections.forEach(d => {
        if (d.status === 'Bunking') {
          const alertId = uid();
          setAlerts(prev => {
            // Avoid duplicate alerts
            if (prev.some(a => a.studentName === d.name && Date.now() - a.time < 60000)) {
              return prev;
            }

            const newAlert = {
              id: alertId,
              studentName: d.name,
              location: d.location,
              timestamp: now(),
              time: Date.now(),
              messageSent: false
            };

            // Simulate email sending
            setTimeout(() => {
              setAlerts(p => p.map(a => a.id === alertId ? { ...a, messageSent: true } : a));
            }, 1500);

            return [newAlert, ...prev].slice(0, 20);
          });
        }
      });

      setDetections(receivedDetections);
    });

    // Load exemptions from backend
    fetch('/api/exemptions')
      .then(r => r.json())
      .then(data => setExemptions(data))
      .catch(e => console.error('Failed to load exemptions:', e));

    return () => s.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-gray-100 flex flex-col">
      <header className="border-b border-neutral-800/80 bg-neutral-900/60 backdrop-blur sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              <ShieldCheck className="h-6 w-6 text-emerald-400" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold tracking-tight text-white">Live Monitoring</h1>
              <p className="text-[10px] text-emerald-400 font-semibold uppercase tracking-widest leading-none mt-1">Real-time Face Recognition</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${videoConnected ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
              <span className={`w-2 h-2 rounded-full ${videoConnected ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`}></span>
              <span className="text-xs font-medium">{videoConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-7xl w-full px-6 py-8 grid grid-cols-12 gap-8">
        <section className="col-span-12 lg:col-span-8 space-y-8">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 bg-neutral-900/80 border-b border-neutral-800">
              <h2 className="text-sm font-bold flex items-center gap-2 tracking-wide uppercase">
                <Video className="h-4 w-4 text-sky-400" /> Live Camera Feed
              </h2>
              <div className="flex gap-4 items-center">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span><span className="text-[10px] uppercase font-bold text-blue-400">Class</span></div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500"></span><span className="text-[10px] uppercase font-bold text-green-400">Auth</span></div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500"></span><span className="text-[10px] uppercase font-bold text-red-400">Bunk</span></div>
              </div>
            </div>
            <div className="relative aspect-video bg-black group overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.8)_100%)] z-10 pointer-events-none"></div>
              {videoConnected ? (
                <img
                  src="/video_feed"
                  alt="Live Feed"
                  className="w-full h-full object-contain"
                  onError={(e) => { e.target.style.display = 'none'; setVideoConnected(false); }}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30 select-none">
                  <WifiOff className="h-16 w-16 mb-4 text-neutral-600" />
                  <p className="text-xs font-bold tracking-[0.2em] uppercase">Camera Feed Unavailable</p>
                </div>
              )}

              {/* Detection overlays */}
              {detections.map(d => {
                const styles = statusStyles(d.status);
                return (
                  <div
                    key={d.id}
                    className={`absolute ${styles.border} ${styles.bg} rounded-xl border-2 transition-all duration-300 z-20`}
                    style={{ left: `${d.x}%`, top: `${d.y}%`, width: `${d.w}%`, height: `${d.h}%` }}
                  >
                    <div className={`absolute -top-10 left-0 ${styles.text} bg-neutral-900/90 backdrop-blur px-3 py-1.5 rounded-lg border border-neutral-700 shadow-2xl whitespace-nowrap`}>
                      <p className="text-xs font-bold">{d.name}</p>
                      <p className="text-[10px] opacity-70 font-medium">{d.status} • {d.location}</p>
                      {d.proba && <p className="text-[9px] opacity-50">{(d.proba * 100).toFixed(0)}% conf</p>}
                    </div>
                  </div>
                );
              })}
              <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] blend-overlay"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/40">
              <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-6 flex items-center gap-2">
                <Activity className="h-4 w-4 text-emerald-400" /> Attendance logs
              </h3>
              <div className="space-y-4">
                {classes.map(c => (
                  <div key={c.name} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-neutral-500">{c.name}</span>
                      <span>{c.current}/{c.expected}</span>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]" style={{ width: `${(c.current / c.expected) * 100}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/40">
              <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-6 flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-purple-400" /> Quick Exemption
              </h3>
              <div className="space-y-3">
                <input
                  value={newExName}
                  onChange={e => setNewExName(e.target.value)}
                  placeholder="Student Name"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-xs focus:ring-1 focus:ring-purple-500 transition outline-none"
                />
                <select
                  value={newExReason}
                  onChange={e => setNewExReason(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2 text-xs outline-none focus:ring-1 focus:ring-purple-500 transition appearance-none"
                >
                  <option value="">Choose Reason</option>
                  {sampleReasons.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <button
                  onClick={() => {
                    if (newExName && newExReason) {
                      // In a real app, you'd POST to the API here
                      setExemptions([{ id: uid(), student_name: newExName, reason: newExReason }, ...exemptions]);
                      setNewExName('');
                      setNewExReason('');
                    }
                  }}
                  className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition shadow-lg shadow-purple-900/20"
                >
                  Add Exemption
                </button>
              </div>
            </div>
          </div>
        </section>

        <aside className="col-span-12 lg:col-span-4 h-fit">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 overflow-hidden shadow-xl">
            <div className="px-6 py-4 border-b border-neutral-800 bg-neutral-900/80 flex justify-between items-center">
              <h3 className="text-xs font-bold tracking-widest uppercase flex items-center gap-2">
                <Bell className="h-4 w-4 text-amber-500" /> Alert Feed
              </h3>
              <span className="text-[10px] font-bold bg-neutral-800 px-2 py-0.5 rounded text-neutral-500 tracking-tighter">{alerts.length} ALERTS</span>
            </div>
            <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
              {alerts.map(a => (
                <div key={a.id} className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 group transition-all hover:border-red-500/50">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wide">{a.studentName}</h4>
                    <AlertTriangle className="h-3.5 w-3.5 text-red-500 animate-pulse" />
                  </div>
                  <div className="flex gap-4 text-[10px] text-neutral-500 font-medium mb-3">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {a.location}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {a.timestamp}</span>
                  </div>
                  <div className={`mt-2 pt-2 border-t border-neutral-900 flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider ${a.messageSent ? 'text-emerald-500' : 'text-amber-500'}`}>
                    {a.messageSent ? <CheckCircle className="h-3.5 w-3.5" /> : <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    <span>{a.messageSent ? 'Email Sent' : 'Sending Email...'}</span>
                  </div>
                </div>
              ))}
              {alerts.length === 0 && (
                <div className="py-12 text-center opacity-20 font-bold uppercase tracking-widest text-xs">No active alerts</div>
              )}
            </div>
          </div>
        </aside>
      </main>

      <footer className="p-8 mt-auto border-t border-neutral-900">
        <div className="mx-auto max-w-7xl flex justify-between items-center opacity-30 text-[10px] uppercase font-bold tracking-[0.2em]">
          <span>EcoTrack v1.0.0</span>
          <span>Secure Channel Active</span>
        </div>
      </footer>
    </div>
  );
}

export default LiveMonitor;
