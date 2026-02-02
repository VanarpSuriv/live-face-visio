import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Shield,
  Settings,
  Video,
  PlayCircle,
  Link2,
  AlertTriangle,
  Wifi,
  WifiOff,
} from "lucide-react";
import { getCurrentPeriod, getSubjectName, SUBJECTS } from "@/data/timetable";

interface Incident {
  id: string;
  studentName: string;
  time: string;
  type: "bunk" | "late" | "unauthorized";
}

export default function LiveMonitor() {
  const [backendUrl, setBackendUrl] = useState("http://localhost:5001");
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [currentClass, setCurrentClass] = useState<{ period: number; subject: string | null; day: string } | null>(null);
  const [recognizedStudents, setRecognizedStudents] = useState<string[]>([]);

  useEffect(() => {
    const updateCurrentClass = () => {
      const current = getCurrentPeriod();
      setCurrentClass(current);
    };
   
    updateCurrentClass();
    const interval = setInterval(updateCurrentClass, 30000); // Update every 30 seconds
   
    return () => clearInterval(interval);
  }, []);

  const handleConnect = async () => {
    setIsConnecting(true);
   
    // Simulate connection attempt
    setTimeout(() => {
      setIsConnected(true);
      setIsConnecting(false);
    }, 1500);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setRecognizedStudents([]);
  };

  const handleSimulate = () => {
    // Simulate face detection
    const mockStudents = ["Pranav A", "Raghuraman R", "Shivani T", "Kumar S", "Priya M"];
    const randomStudents = mockStudents.slice(0, Math.floor(Math.random() * 5) + 1);
    setRecognizedStudents(randomStudents);
   
    // Simulate an incident occasionally
    if (Math.random() > 0.7) {
      const newIncident: Incident = {
        id: Date.now().toString(),
        studentName: mockStudents[Math.floor(Math.random() * mockStudents.length)],
        time: new Date().toLocaleTimeString(),
        type: "bunk",
      };
      setIncidents((prev) => [newIncident, ...prev].slice(0, 10));
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
              <Shield className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Smart Campus</h1>
              <p className="text-sm text-primary font-medium tracking-wide">
                ATTENDANCE & BUNKING TRACKER
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <Settings className="h-4 w-4" />
              Backend
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Video className="h-4 w-4" />
              Start Webcam
            </Button>
            <Button
              size="sm"
              className="gap-2 bg-primary hover:bg-primary/90"
              onClick={handleSimulate}
            >
              <PlayCircle className="h-4 w-4" />
              Simulate
            </Button>
          </div>
        </div>

        {/* Current Class Info */}
        {currentClass && (
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-sm text-muted-foreground">Currently in session:</p>
            <p className="text-lg font-semibold text-foreground">
              Period {currentClass.period} - {getSubjectName(currentClass.subject)}
            </p>
          </div>
        )}

        {/* Connection Input */}
        <div className="flex items-center gap-4">
          <Input
            value={backendUrl}
            onChange={(e) => setBackendUrl(e.target.value)}
            placeholder="Enter backend URL..."
            className="flex-1 bg-secondary border-border"
          />
          <Button
            onClick={isConnected ? handleDisconnect : handleConnect}
            disabled={isConnecting}
            className={`gap-2 min-w-[120px] ${
              isConnected
                ? "bg-destructive hover:bg-destructive/90"
                : "bg-primary hover:bg-primary/90"
            }`}
          >
            <Link2 className="h-4 w-4" />
            {isConnecting ? "Connecting..." : isConnected ? "Disconnect" : "Connect"}
          </Button>
          <span className="text-sm text-muted-foreground">
            Connect to your Python backend for real face recognition
          </span>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Live Feed */}
          <Card className="lg:col-span-2 bg-card border-border card-glow">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div className="flex items-center gap-2">
                <Video className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">LIVE SURVEILLANCE FEED</CardTitle>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="status-class gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-blue-400" />
                  CLASS
                </Badge>
                <Badge className="status-bunk gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-400" />
                  BUNK
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
