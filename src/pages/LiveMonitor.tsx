import { useState, useEffect, useRef, useCallback } from 'react';
import {
  ShieldCheck,
  Camera,
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
  Loader2,
  Settings,
  Link as LinkIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

// Utilities
const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
const now = () => new Date().toLocaleTimeString();

// Sample data
const sampleStudents = ['John Doe', 'Jane Smith', 'Alex Lee', 'Priya Patel', 'Wei Chen', 'Carlos Ramirez', 'Aisha Khan', 'Emily Clark', 'Michael Brown', 'Sara Johnson'];
const sampleReasons = ['Sports Competition', 'Medical', 'Library Duty', 'Lab Prep', 'Placement Event'];
const sampleLocations = ['Cafeteria', 'Library', 'Quad', 'Gym', 'Parking Lot', 'Corridor', 'Garden'];
const inClassLocations = ['Room 101', 'Room 202', 'CS Lab', 'Lecture Hall A'];

interface Detection {
  id: string;
  name: string;
  status: 'Bunking' | 'Authorized' | 'In Class';
  x: number;
  y: number;
  w: number;
  h: number;
  location: string;
  proba?: number;
}

interface Alert {
  id: string;
  studentName: string;
  location: string;
  timestamp: string;
  messageSent: boolean;
}

interface Exemption {
  id: string;
  name: string;
  reason: string;
}

interface ClassInfo {
  name: string;
  expected: number;
  current: number;
}

function randomBox() {
  const w = 15 + Math.random() * 15;
  const h = 20 + Math.random() * 20;
  const x = Math.random() * (100 - w - 4) + 2;
  const y = Math.random() * (100 - h - 4) + 2;
  return { x, y, w, h };
}

function statusStyles(status: string) {
  switch (status) {
    case 'Bunking': return { border: 'border-destructive', bg: 'bg-destructive/10', text: 'text-red-300' };
    case 'Authorized': return { border: 'border-success', bg: 'bg-success/10', text: 'text-green-300' };
    case 'In Class': return { border: 'border-info', bg: 'bg-info/10', text: 'text-blue-300' };
    default: return { border: 'border-muted', bg: 'bg-muted/10', text: 'text-muted-foreground' };
  }
}

const LiveMonitor = () => {
  const { toast } = useToast();
  const [detections, setDetections] = useState<Detection[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [exemptions, setExemptions] = useState<Exemption[]>([
    { id: '1', name: 'Jane Smith', reason: 'Medical' },
    { id: '2', name: 'Alex Lee', reason: 'Sports Competition' }
  ]);
  const [search, setSearch] = useState('');
  const [newExName, setNewExName] = useState('');
  const [newExReason, setNewExReason] = useState('');
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [isConnectedToBackend, setIsConnectedToBackend] = useState(false);
  const [backendUrl, setBackendUrl] = useState('http://localhost:5001');
  const [showSettings, setShowSettings] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const socketRef = useRef<any>(null);

  const [classes, setClasses] = useState<ClassInfo[]>([
    { name: 'CS101', expected: 60, current: 54 },
    { name: 'EE207', expected: 45, current: 42 },
    { name: 'MA110', expected: 50, current: 48 },
    { name: 'BIO150', expected: 40, current: 36 }
  ]);

  // Connect to backend video feed
  const connectToBackend = useCallback(() => {
    if (imgRef.current) {
      imgRef.current.src = `${backendUrl}/video_feed`;
      setIsConnectedToBackend(true);
      toast({
        title: "Connected to Backend",
        description: `Streaming from ${backendUrl}`,
      });
    }
  }, [backendUrl, toast]);

  // Disconnect from backend
  const disconnectFromBackend = useCallback(() => {
    if (imgRef.current) {
      imgRef.current.src = '';
    }
    setIsConnectedToBackend(false);
    setDetections([]);
  }, []);

  // Local webcam handling
  useEffect(() => {
    if (isWebcamActive && videoRef.current && !isConnectedToBackend) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.error(err);
          setIsWebcamActive(false);
          toast({
            title: "Camera Error",
            description: "Could not access webcam",
            variant: "destructive",
          });
        });
    } else if (!isWebcamActive && videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  }, [isWebcamActive, isConnectedToBackend, toast]);

  // WebSocket connection for real-time detections
  useEffect(() => {
    if (isConnectedToBackend) {
      try {
        // Dynamically import socket.io-client
        import('socket.io-client').then(({ io }) => {
          socketRef.current = io(backendUrl);
          
          socketRef.current.on('detections_update', (data: { detections: Detection[] }) => {
            setDetections(data.detections);
            
            // Create alerts for bunking detections
            data.detections.forEach(d => {
              if (d.status === 'Bunking' && !exemptions.some(e => e.name.toLowerCase() === d.name.toLowerCase())) {
                const alertId = uid();
                setAlerts(prev => [{
                  id: alertId,
                  studentName: d.name,
                  location: d.location,
                  timestamp: now(),
                  messageSent: false
                }, ...prev].slice(0, 20));
                
                setTimeout(() => {
                  setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, messageSent: true } : a));
                }, 1500);
              }
            });
          });
        }).catch(() => {
          // Socket.io not available, use polling instead
          console.log('Socket.io not available, using simulation mode');
        });
      } catch (e) {
        console.log('WebSocket not available');
      }
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [isConnectedToBackend, backendUrl, exemptions]);

  // Simulate detection (for demo without backend)
  const simulateDetection = () => {
    const name = sampleStudents[Math.floor(Math.random() * sampleStudents.length)];
    const box = randomBox();
    const r = Math.random();
    let status: Detection['status'];
    let location: string;

    if (r < 0.45) {
      status = 'Bunking';
      location = sampleLocations[Math.floor(Math.random() * sampleLocations.length)];
      if (exemptions.some(e => e.name.toLowerCase() === name.toLowerCase())) {
        status = 'Authorized';
      } else {
        const id = uid();
        setAlerts(prev => [{ id, studentName: name, location, timestamp: now(), messageSent: false }, ...prev].slice(0, 20));
        setTimeout(() => setAlerts(prev => prev.map(a => a.id === id ? { ...a, messageSent: true } : a)), 1500);
      }
    } else if (r < 0.80) {
      status = 'Authorized';
      location = sampleLocations[Math.floor(Math.random() * sampleLocations.length)];
    } else {
      status = 'In Class';
      location = inClassLocations[Math.floor(Math.random() * inClassLocations.length)];
    }

    setDetections(prev => [{ id: uid(), name, status, ...box, location }, ...prev].slice(0, 6));
  };

  // Add exemption
  const addExemption = () => {
    if (newExName && newExReason) {
      setExemptions(prev => [{ id: uid(), name: newExName, reason: newExReason }, ...prev]);
      setNewExName('');
      setNewExReason('');
      toast({
        title: "Exemption Added",
        description: `${newExName} is now authorized`,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-white/10 bg-card/60 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold tracking-tight">Smart Campus</h1>
              <p className="text-[10px] text-primary font-semibold uppercase tracking-widest">Attendance & Bunking Tracker</p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="border-white/10"
            >
              <Settings className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Backend</span>
            </Button>
            
            {isConnectedToBackend ? (
              <Button
                onClick={disconnectFromBackend}
                variant="destructive"
                size="sm"
              >
                <WifiOff className="h-4 w-4 mr-2" />
                Disconnect
              </Button>
            ) : (
              <Button
                onClick={() => setIsWebcamActive(!isWebcamActive)}
                variant={isWebcamActive ? "destructive" : "secondary"}
                size="sm"
              >
                <Camera className="h-4 w-4 mr-2" />
                {isWebcamActive ? 'Stop' : 'Start'} Webcam
              </Button>
            )}
            
            <Button onClick={simulateDetection} size="sm" className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Simulate</span>
            </Button>
          </div>
        </div>
        
        {/* Backend Settings Panel */}
        {showSettings && (
          <div className="border-t border-white/10 bg-card/80 backdrop-blur px-4 md:px-6 py-4">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex-1 flex gap-2 w-full sm:w-auto">
                <Input
                  value={backendUrl}
                  onChange={(e) => setBackendUrl(e.target.value)}
                  placeholder="Backend URL (e.g., http://localhost:5001)"
                  className="bg-background/50 border-white/10 flex-1"
                />
                <Button onClick={connectToBackend} className="bg-primary hover:bg-primary/90">
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Connect
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Connect to your Python backend for real face recognition
              </p>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-8 grid grid-cols-12 gap-6 md:gap-8">
        {/* Left Column - Video Feed & Controls */}
        <section className="col-span-12 lg:col-span-8 space-y-6 md:space-y-8">
          {/* Video Feed */}
          <div className="glass-panel overflow-hidden">
            <div className="flex items-center justify-between px-4 md:px-6 py-4 bg-card/80 border-b border-white/10">
              <h2 className="text-sm font-bold flex items-center gap-2 uppercase tracking-wide">
                <Video className="h-4 w-4 text-info" /> Live Surveillance Feed
              </h2>
              <div className="flex gap-4 items-center">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-info animate-pulse" />
                  <span className="text-[10px] uppercase font-bold text-info">Class</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-destructive" />
                  <span className="text-[10px] uppercase font-bold text-destructive">Bunk</span>
                </div>
              </div>
            </div>
            
            <div className="relative aspect-video bg-black overflow-hidden group">
              {/* Vignette overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] z-10 pointer-events-none" />
              
              {/* Video Sources */}
              {isConnectedToBackend ? (
                <img
                  ref={imgRef}
                  alt="Backend Video Feed"
                  className="w-full h-full object-cover opacity-70 grayscale contrast-125"
                  onError={() => {
                    setIsConnectedToBackend(false);
                    toast({
                      title: "Connection Lost",
                      description: "Could not connect to backend",
                      variant: "destructive",
                    });
                  }}
                />
              ) : isWebcamActive ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover scale-x-[-1] opacity-70 grayscale contrast-125"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30 select-none">
                  <WifiOff className="h-16 w-16 mb-4 text-muted-foreground" />
                  <p className="text-xs font-bold tracking-[0.2em] uppercase">Signal Encrypted / Standby</p>
                </div>
              )}

              {/* Detection Overlays */}
              {detections.map(d => {
                const styles = statusStyles(d.status);
                return (
                  <div
                    key={d.id}
                    className={cn(
                      "absolute border-2 rounded-xl transition-all duration-500 z-20",
                      styles.border, styles.bg
                    )}
                    style={{
                      left: `${d.x}%`,
                      top: `${d.y}%`,
                      width: `${d.w}%`,
                      height: `${d.h}%`
                    }}
                  >
                    <div className={cn(
                      "absolute -top-10 left-0 bg-card/90 backdrop-blur px-3 py-1.5 rounded-lg border border-white/10 shadow-2xl whitespace-nowrap",
                      styles.text
                    )}>
                      <p className="text-xs font-bold">{d.name}</p>
                      <p className="text-[10px] opacity-70 font-medium">{d.status} • {d.location}</p>
                    </div>
                  </div>
                );
              })}

              {/* Noise overlay */}
              <div className="absolute inset-0 pointer-events-none opacity-10 noise-overlay" />
            </div>
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Attendance Logs */}
            <div className="glass-panel p-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" /> Attendance Logs
              </h3>
              <div className="space-y-4">
                {classes.map(c => (
                  <div key={c.name} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-muted-foreground">{c.name}</span>
                      <span>{c.current}/{c.expected}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary shadow-[0_0_10px_rgba(0,230,184,0.4)]"
                        style={{ width: `${(c.current / c.expected) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fast Exemption */}
            <div className="glass-panel p-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-info" /> Fast Exemption
              </h3>
              <div className="space-y-3">
                <Input
                  value={newExName}
                  onChange={e => setNewExName(e.target.value)}
                  placeholder="Student Name"
                  className="bg-background/50 border-white/10 text-sm"
                />
                <Select value={newExReason} onValueChange={setNewExReason}>
                  <SelectTrigger className="bg-background/50 border-white/10 text-sm">
                    <SelectValue placeholder="Choose Reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {sampleReasons.map(r => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={addExemption}
                  className="w-full bg-info hover:bg-info/90 text-info-foreground"
                >
                  Add Authority
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column - Alerts */}
        <aside className="col-span-12 lg:col-span-4 h-fit">
          <div className="glass-panel overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 bg-card/80 flex justify-between items-center">
              <h3 className="text-xs font-bold tracking-widest uppercase flex items-center gap-2">
                <Bell className="h-4 w-4 text-warning" /> Incident List
              </h3>
              <span className="text-[10px] font-bold bg-muted px-2 py-0.5 rounded text-muted-foreground">
                {alerts.length} ITEMS
              </span>
            </div>
            <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
              {alerts.map(a => (
                <div
                  key={a.id}
                  className="p-4 rounded-xl bg-card border border-white/10 group transition-all hover:border-destructive/50"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-xs font-bold uppercase tracking-wide">{a.studentName}</h4>
                    <AlertTriangle className="h-3.5 w-3.5 text-destructive animate-pulse" />
                  </div>
                  <div className="flex gap-4 text-[10px] text-muted-foreground font-medium mb-3">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {a.location}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {a.timestamp}</span>
                  </div>
                  <div className={cn(
                    "mt-2 pt-2 border-t border-white/5 flex items-center gap-2 text-[9px] font-bold uppercase tracking-wider",
                    a.messageSent ? 'text-primary' : 'text-warning'
                  )}>
                    {a.messageSent ? (
                      <CheckCircle className="h-3.5 w-3.5" />
                    ) : (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    )}
                    <span>{a.messageSent ? 'Advisor Notified' : 'Dispatching SMS...'}</span>
                  </div>
                </div>
              ))}
              {alerts.length === 0 && (
                <div className="py-12 text-center opacity-20 font-bold uppercase tracking-widest text-xs">
                  No active violations
                </div>
              )}
            </div>
          </div>
        </aside>
      </main>

      {/* Footer */}
      <footer className="p-8 mt-auto border-t border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center opacity-30 text-[10px] uppercase font-bold tracking-[0.2em]">
          <span>System v2.5.0-Deployment</span>
          <span>Secure Channel 01 Active</span>
        </div>
      </footer>
    </div>
  );
};

export default LiveMonitor;
