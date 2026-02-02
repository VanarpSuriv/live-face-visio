import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Dumbbell, School, Coffee, Activity } from 'lucide-react';

const locations = [
  { name: 'Library', count: 45, capacity: 100, icon: Book },
  { name: 'MPH', count: 78, capacity: 150, icon: Dumbbell },
  { name: 'Classroom Block 1', count: 120, capacity: 200, icon: School },
  { name: 'Classroom Block 2', count: 95, capacity: 200, icon: School },
  { name: 'Classroom Block 3', count: 88, capacity: 200, icon: School },
  { name: 'Classroom Block 4', count: 156, capacity: 200, icon: School },
  { name: 'Classroom Block 5', count: 62, capacity: 200, icon: School },
  { name: 'Cafeteria', count: 34, capacity: 200, icon: Coffee },
];

const logMessages = [
  "Privacy Check: All data anonymized locally.",
  "Zone Sync: Library occupancy data updated.",
  "System Check: Campus mesh network stable.",
  "Data Stream: Classroom Block 1 sensors active.",
  "Analytics: Peak traffic detected in MPH.",
  "Security: System-wide integrity check passed.",
  "Network: Latency optimal at 12ms.",
  "Node Status: Cafeteria sensors online."
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [log, setLog] = useState(logMessages[0]);
  const [timeStamp, setTimeStamp] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const interval = setInterval(() => {
      const randomMsg = logMessages[Math.floor(Math.random() * logMessages.length)];
      setLog(randomMsg);
      setTimeStamp(new Date().toLocaleTimeString());
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full space-y-8 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campus Locations</h1>
          <p className="text-muted-foreground mt-1">Real-time occupancy monitoring</p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg border border-primary/20">
          <Activity className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-sm text-primary font-medium">Live</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {locations.map((loc) => {
          const Icon = loc.icon;
          const percentage = (loc.count / loc.capacity) * 100;
          const isCritical = percentage > 80;
          const isHigh = percentage > 50;
          
          const colorConfig = isCritical
            ? { bg: 'bg-destructive/10', text: 'text-red-400', border: 'border-destructive/20', bar: 'bg-destructive' }
            : isHigh
            ? { bg: 'bg-warning/10', text: 'text-yellow-400', border: 'border-warning/20', bar: 'bg-warning' }
            : { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/20', bar: 'bg-primary' };

          return (
            <div
              key={loc.name}
              className="glass-panel p-6 hover:border-white/20 transition-all duration-300 group cursor-pointer"
              onClick={() => navigate('/dashboard/monitor')}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${colorConfig.bg} ${colorConfig.text} flex items-center justify-center border ${colorConfig.border}`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-bold">{loc.name}</h3>
                </div>
                <div className={`text-3xl font-black ${colorConfig.text}`}>
                  {loc.count}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-3">
                <div className="relative w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${colorConfig.bar}`}
                    style={{ width: `${Math.min(100, percentage)}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>Active Users</span>
                  <span className="font-mono">{loc.count}/{loc.capacity}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Terminal Log */}
      <div className="max-w-2xl">
        <div className="glass-panel bg-card/90 p-4 rounded-2xl relative overflow-hidden">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-destructive" />
              <div className="w-3 h-3 rounded-full bg-warning" />
              <div className="w-3 h-3 rounded-full bg-success" />
            </div>
            <span className="text-xs text-muted-foreground font-mono ml-4">system_log.sh</span>
          </div>
          <div className="font-mono text-sm flex items-center gap-3">
            <span className="text-primary font-bold">&gt;</span>
            <span className="text-primary/60">[{timeStamp}]</span>
            <span className="text-primary truncate">{log}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
