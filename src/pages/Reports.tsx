import { FileText, Download, Calendar, Filter, FileSpreadsheet, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const reportTypes = [
  { id: 'daily', name: 'Daily Attendance Report', description: 'Complete attendance data for the day', icon: FileText, date: '2026-02-02', size: '245 KB' },
  { id: 'weekly', name: 'Weekly Summary Report', description: 'Aggregated data for the past 7 days', icon: FileSpreadsheet, date: '2026-02-01', size: '1.2 MB' },
  { id: 'monthly', name: 'Monthly Analytics Report', description: 'Detailed analytics and trends', icon: File, date: '2026-02-01', size: '3.5 MB' },
  { id: 'bunking', name: 'Bunking Incident Report', description: 'All flagged incidents this month', icon: FileText, date: '2026-02-02', size: '180 KB' },
  { id: 'exemption', name: 'Exemption Log Report', description: 'All approved exemptions', icon: FileSpreadsheet, date: '2026-02-01', size: '95 KB' },
];

const recentReports = [
  { name: 'attendance_20260201.csv', type: 'Daily Attendance', date: '2026-02-01', size: '245 KB' },
  { name: 'weekly_summary_w5.pdf', type: 'Weekly Summary', date: '2026-01-31', size: '1.2 MB' },
  { name: 'bunking_jan2026.xlsx', type: 'Bunking Report', date: '2026-01-31', size: '380 KB' },
  { name: 'monthly_jan2026.pdf', type: 'Monthly Report', date: '2026-01-31', size: '3.5 MB' },
  { name: 'attendance_20260131.csv', type: 'Daily Attendance', date: '2026-01-31', size: '238 KB' },
];

const Reports = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground mt-1">Generate and download attendance reports</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="feb2026">
            <SelectTrigger className="w-40 bg-background/50 border-white/10">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="feb2026">Feb 2026</SelectItem>
              <SelectItem value="jan2026">Jan 2026</SelectItem>
              <SelectItem value="dec2025">Dec 2025</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Report Types */}
      <div>
        <h2 className="text-lg font-bold mb-4">Generate Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTypes.map((report) => {
            const Icon = report.icon;
            return (
              <div key={report.id} className="glass-panel p-6 hover:border-primary/30 transition-all group">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold mb-1">{report.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{report.description}</p>
                    <Button size="sm" className="w-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20">
                      <Download className="h-4 w-4 mr-2" />
                      Generate
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Reports */}
      <div>
        <h2 className="text-lg font-bold mb-4">Recent Downloads</h2>
        <div className="glass-panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-card/80 border-b border-white/10">
                <tr>
                  <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">File Name</th>
                  <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Type</th>
                  <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Date</th>
                  <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Size</th>
                  <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentReports.map((report, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-mono text-sm">{report.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{report.type}</td>
                    <td className="p-4 text-muted-foreground">{report.date}</td>
                    <td className="p-4 text-muted-foreground">{report.size}</td>
                    <td className="p-4">
                      <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                        <Download className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
