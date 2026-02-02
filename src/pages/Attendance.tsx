import { useState } from 'react';
import { Search, Filter, Download, CheckCircle, XCircle, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AttendanceRecord {
  id: string;
  name: string;
  registrationNo: string;
  date: string;
  time: string;
  status: 'Present' | 'Absent' | 'Late';
  location: string;
  facultyIncharge: string; // New field
}

const mockRecords: AttendanceRecord[] = [
  { id: '1', name: 'Pranav A', registrationNo: 'CS2024001', date: '2026-02-02', time: '09:05', status: 'Present', location: 'Classroom Block 1', facultyIncharge: 'Mr. Arun' },
  { id: '2', name: 'Suresh', registrationNo: 'CS2024002', date: '2026-02-02', time: '09:15', status: 'Late', location: 'Classroom Block 1', facultyIncharge: 'Mr. Arun' },
  { id: '3', name: 'Modhini', registrationNo: 'CS2024003', date: '2026-02-02', time: '-', status: 'Absent', location: '-', facultyIncharge: 'Dr. Sharon' },
  { id: '4', name: 'Rishe', registrationNo: 'CS2024004', date: '2026-02-02', time: '08:55', status: 'Present', location: 'Library', facultyIncharge: 'Dr. Sharon' },
  { id: '5', name: 'Shivvani', registrationNo: 'CS2024005', date: '2026-02-02', time: '09:02', status: 'Present', location: 'CS Lab', facultyIncharge: 'Mr. Arun' },
  { id: '6', name: 'Srivatsan', registrationNo: 'CS2024006', date: '2026-02-02', time: '09:30', status: 'Late', location: 'Cafeteria', facultyIncharge: 'Dr. Sharon' },
];

const Attendance = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredRecords = mockRecords.filter(record => {
    const matchesSearch = 
      record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.registrationNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.facultyIncharge.toLowerCase().includes(searchTerm.toLowerCase()); // Search by faculty too
    const matchesFilter = filterStatus === 'all' || record.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: mockRecords.length,
    present: mockRecords.filter(r => r.status === 'Present').length,
    absent: mockRecords.filter(r => r.status === 'Absent').length,
    late: mockRecords.filter(r => r.status === 'Late').length,
  };

  const statusConfig = {
    Present: { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10' },
    Absent: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10' },
    Late: { icon: Clock, color: 'text-warning', bg: 'bg-warning/10' },
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
          <p className="text-muted-foreground mt-1">Track and manage student attendance</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg"><Users className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground uppercase">Total</p>
            </div>
          </div>
        </div>
        <div className="glass-panel p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success/10 rounded-lg"><CheckCircle className="h-5 w-5 text-success" /></div>
            <div>
              <p className="text-2xl font-bold">{stats.present}</p>
              <p className="text-xs text-muted-foreground uppercase">Present</p>
            </div>
          </div>
        </div>
        <div className="glass-panel p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-destructive/10 rounded-lg"><XCircle className="h-5 w-5 text-destructive" /></div>
            <div>
              <p className="text-2xl font-bold">{stats.absent}</p>
              <p className="text-xs text-muted-foreground uppercase">Absent</p>
            </div>
          </div>
        </div>
        <div className="glass-panel p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning/10 rounded-lg"><Clock className="h-5 w-5 text-warning" /></div>
            <div>
              <p className="text-2xl font-bold">{stats.late}</p>
              <p className="text-xs text-muted-foreground uppercase">Late</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, reg no, or faculty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-background/50 border-white/10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full md:w-48 bg-background/50 border-white/10">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="present">Present</SelectItem>
            <SelectItem value="absent">Absent</SelectItem>
            <SelectItem value="late">Late</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-card/80 border-b border-white/10">
              <tr>
                <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Student</th>
                <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Reg. No</th>
                <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Faculty Incharge</th>
                <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Date</th>
                <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Time</th>
                <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Location</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => {
                const StatusIcon = statusConfig[record.status].icon;
                return (
                  <tr key={record.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 font-medium">{record.name}</td>
                    <td className="p-4 text-muted-foreground font-mono text-sm">{record.registrationNo}</td>
                    <td className="p-4 text-sm font-medium text-primary/80">{record.facultyIncharge}</td>
                    <td className="p-4 text-muted-foreground">{record.date}</td>
                    <td className="p-4 text-muted-foreground">{record.time}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[record.status].bg} ${statusConfig[record.status].color}`}>
                        <StatusIcon className="h-3 w-3" />
                        {record.status}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">{record.location}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
