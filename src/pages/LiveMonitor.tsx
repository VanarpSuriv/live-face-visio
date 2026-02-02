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

/* ================= UTILITIES ================= */

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
const now = () => new Date().toLocaleTimeString();

const sampleStudents = [
  'John Doe','Jane Smith','Alex Lee','Priya Patel','Wei Chen',
  'Carlos Ramirez','Aisha Khan','Emily Clark','Michael Brown','Sara Johnson'
];

const sampleReasons = [
  'Sports Competition','Medical','Library Duty','Lab Prep','Placement Event'
];

const sampleLocations = [
  'Cafeteria','Library','Quad','Gym','Parking Lot','Corridor','Garden'
];

const inClassLocations = [
  'Room 101','Room 202','CS Lab','Lecture Hall A'
];

/* ================= TYPES ================= */

interface Detection {
  id: string;
  name: string;
  status: 'Bunking' | 'Authorized' | 'In Class';
  x: number;
  y: number;
  w: number;
  h: number;
  location: string;
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

/* ================= HELPERS ================= */

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

/* ================= COMPONENT ================= */

const LiveMonitor = () => {
  const { toast } = useToast();

  const [detections, setDetections] = useState<Detection[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [exemptions, setExemptions] = useState<Exemption[]>([
    { id: '1', name: 'Jane Smith', reason: 'Medical' },
    { id: '2', name: 'Alex Lee', reason: 'Sports Competition' }
  ]);

  const [newExName, setNewExName] = useState('');
  const [newExReason, setNewExReason] = useState('');
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  const [classes] = useState<ClassInfo[]>([
    { name: 'CS101', expected: 60, current: 54 },
    { name: 'EE207', expected: 45, current: 42 },
    { name: 'MA110', expected: 50, current: 48 },
    { name: 'BIO150', expected: 40, current: 36 }
  ]);

  /* ================= SIMULATION ================= */

  const simulateDetection = () => {
    const name = sampleStudents[Math.floor(Math.random() * sampleStudents.length)];
    const box = randomBox();
    const r = Math.random();

    let status: Detection['status'] = 'In Class';
    let location = inClassLocations[Math.floor(Math.random() * inClassLocations.length)];

    if (r < 0.45) {
      status = 'Bunking';
      location = sampleLocations[Math.floor(Math.random() * sampleLocations.length)];
    }

    setDetections(prev => [
      { id: uid(), name, status, ...box, location },
      ...prev
    ].slice(0, 6));

    if (status === 'Bunking') {
      const id = uid();
      setAlerts(prev => [
        { id, studentName: name, location, timestamp: now(), messageSent: false },
        ...prev
      ].slice(0, 20));

      setTimeout(() => {
        setAlerts(prev =>
          prev.map(a => a.id === id ? { ...a, messageSent: true } : a)
        );
      }, 1500);
    }
  };

  /* ================= ADD EXEMPTION ================= */

  const addExemption = () => {
    if (!newExName || !newExReason) return;

    setExemptions(prev => [
      { id: uid(), name: newExName, reason: newExReason },
      ...prev
    ]);

    toast({
      title: "Exemption Added",
      description: `${newExName} is now authorized`,
    });

    setNewExName('');
    setNewExReason('');
  };

  return (
    <div className="min-h-screen flex flex-col">

      {/* HEADER */}
      <header className="border-b border-white/10 bg-card/60 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Smart Campus</h1>
              <p className="text-[10px] text-primary font-semibold uppercase">
                Attendance & Bunking Tracker
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Backend
            </Button>

            <Button
              onClick={() => setIsWebcamActive(!isWebcamActive)}
              variant={isWebcamActive ? "destructive" : "secondary"}
              size="sm"
            >
              <Camera className="h-4 w-4 mr-2" />
              {isWebcamActive ? 'Stop' : 'Start'} Webcam
            </Button>

            <Button onClick={simulateDetection} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Simulate
            </Button>
          </div>
        </div>

        {/* BACKEND SETTINGS */}
        {showSettings && (
          <div className="border-t border-white/10 bg-card/80 px-6 py-4">
            <div className="max-w-7xl mx-auto flex gap-3 items-center">
              <Input
                value="http://localhost:5001"
                readOnly
                className="bg-background/50 border-white/10"
              />
              <Button
                onClick={() => window.open("http://localhost:5001", "_blank")}
              >
                <LinkIcon className="h-4 w-4 mr-2" />
                Connect
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* MAIN */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-8 grid grid-cols-12 gap-8">
        <section className="col-span-12 lg:col-span-8">
          <div className="aspect-video bg-black flex items-center justify-center">
            {isWebcamActive ? (
              <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
            ) : (
              <WifiOff className="h-20 w-20 text-muted-foreground" />
            )}
          </div>
        </section>

        <aside className="col-span-12 lg:col-span-4 space-y-4">
          {alerts.map(a => (
            <div key={a.id} className="p-4 bg-card border rounded-lg">
              <div className="flex justify-between">
                <span className="font-bold">{a.studentName}</span>
                <AlertTriangle className="text-destructive h-4 w-4" />
              </div>
              <div className="text-xs mt-1 text-muted-foreground">
                {a.location} • {a.timestamp}
              </div>
              <div className="mt-2 text-xs flex items-center gap-2">
                {a.messageSent ? <CheckCircle className="h-3 w-3" /> : <Loader2 className="h-3 w-3 animate-spin" />}
                {a.messageSent ? 'Advisor Notified' : 'Sending Alert'}
              </div>
            </div>
          ))}
        </aside>
      </main>
    </div>
  );
};

export default LiveMonitor;
