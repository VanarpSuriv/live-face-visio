import { useState, useRef } from 'react';
import {
  ShieldCheck,
  Camera,
  Plus,
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

/* ================= STUDENT DATA (FROM ATTENDANCE) ================= */

const STUDENTS = [
  { name: 'Pranav A', roll: 'CS2024001' },
  { name: 'Suresh', roll: 'CS2024002' },
  { name: 'Modhini', roll: 'CS2024003' },
  { name: 'Rishe', roll: 'CS2024004' },
  { name: 'Shivvani', roll: 'CS2024005' },
  { name: 'Srivatsan', roll: 'CS2024006' },
];

const sampleReasons = [
  'Sports Competition',
  'Medical',
  'Library Duty',
  'Lab Prep',
  'Placement Event'
];

const sampleLocations = [
  'Cafeteria',
  'Library',
  'Quad',
  'Gym',
  'Parking Lot',
  'Corridor',
  'Garden'
];

const inClassLocations = [
  'Room 101',
  'Room 202',
  'CS Lab',
  'Lecture Hall A'
];

/* ================= TYPES ================= */

interface Detection {
  id: string;
  name: string;
  roll: string;
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
  roll: string;
  location: string;
  timestamp: string;
  messageSent: boolean;
}

interface Exemption {
  id: string;
  name: string;
  reason: string;
}

/* ================= HELPERS ================= */

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
const now = () => new Date().toLocaleTimeString();

function randomBox() {
  const w = 15 + Math.random() * 15;
  const h = 20 + Math.random() * 20;
  const x = Math.random() * (100 - w - 4) + 2;
  const y = Math.random() * (100 - h - 4) + 2;
  return { x, y, w, h };
}

function statusStyles(status: string) {
  switch (status) {
    case 'Bunking':
      return { border: 'border-destructive', bg: 'bg-destructive/10', text: 'text-red-300' };
    case 'Authorized':
      return { border: 'border-success', bg: 'bg-success/10', text: 'text-green-300' };
    case 'In Class':
      return { border: 'border-info', bg: 'bg-info/10', text: 'text-blue-300' };
    default:
      return { border: 'border-muted', bg: 'bg-muted/10', text: 'text-muted-foreground' };
  }
}

/* ================= COMPONENT ================= */

const LiveMonitor = () => {
  const { toast } = useToast();

  const [detections, setDetections] = useState<Detection[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [exemptions, setExemptions] = useState<Exemption[]>([]);
  const [newExName, setNewExName] = useState('');
  const [newExReason, setNewExReason] = useState('');
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  /* ================= SIMULATE DETECTION ================= */

  const simulateDetection = () => {
    const student = STUDENTS[Math.floor(Math.random() * STUDENTS.length)];
    const box = randomBox();
    const r = Math.random();

    let status: Detection['status'] = 'In Class';
    let location = inClassLocations[Math.floor(Math.random() * inClassLocations.length)];

    if (r < 0.45) {
      status = 'Bunking';
      location = sampleLocations[Math.floor(Math.random() * sampleLocations.length)];
    }

    setDetections(prev => [
      {
        id: uid(),
        name: student.name,
        roll: student.roll,
        status,
        location,
        ...box
      },
      ...prev
    ].slice(0, 6));

    if (status === 'Bunking') {
      const id = uid();
      setAlerts(prev => [
        {
          id,
          studentName: student.name,
          roll: student.roll,
          location,
          timestamp: now(),
          messageSent: false
        },
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
      title: 'Exemption Added',
      description: `${newExName} is now authorized`
    });

    setNewExName('');
    setNewExReason('');
  };

  return (
    <div className="min-h-screen flex flex-col">

      {/* HEADER */}
      <header className="border-b bg-card/60 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-xl font-bold">Smart Campus</h1>
              <p className="text-[10px] uppercase text-primary">Attendance & Bunking Tracker</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setShowSettings(!showSettings)}>
              <Settings className="h-4 w-4 mr-2" />
              Backend
            </Button>

            <Button
              size="sm"
              variant={isWebcamActive ? 'destructive' : 'secondary'}
              onClick={() => setIsWebcamActive(!isWebcamActive)}
            >
              <Camera className="h-4 w-4 mr-2" />
              {isWebcamActive ? 'Stop' : 'Start'} Webcam
            </Button>

            <Button size="sm" onClick={simulateDetection}>
              <Plus className="h-4 w-4 mr-2" />
              Simulate
            </Button>
          </div>
        </div>

        {showSettings && (
          <div className="border-t px-6 py-4">
            <div className="max-w-7xl mx-auto flex gap-3">
              <Input readOnly value="http://localhost:5001" />
              <Button onClick={() => window.open('http://localhost:5001', '_blank')}>
                <LinkIcon className="h-4 w-4 mr-2" />
                Connect
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* ALERTS */}
      <main className="flex-1 max-w-5xl mx-auto px-6 py-8">
        <div className="space-y-4">
          {alerts.map(a => (
            <div key={a.id} className="p-4 border rounded-lg bg-card">
              <div className="flex justify-between">
                <div>
                  <p className="font-bold">{a.studentName}</p>
                  <p className="text-xs text-muted-foreground">{a.roll}</p>
                </div>
                <AlertTriangle className="text-destructive h-4 w-4" />
              </div>
              <div className="text-xs mt-2 flex items-center gap-2">
                <MapPin className="h-3 w-3" />
                {a.location}
                <Clock className="h-3 w-3 ml-4" />
                {a.timestamp}
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs">
                {a.messageSent ? <CheckCircle className="h-3 w-3" /> : <Loader2 className="h-3 w-3 animate-spin" />}
                {a.messageSent ? 'Advisor Notified' : 'Sending Alert'}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default LiveMonitor;
