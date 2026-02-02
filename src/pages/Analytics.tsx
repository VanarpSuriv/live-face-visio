import { TrendingUp, TrendingDown, Users, Clock, AlertTriangle, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const weeklyData = [
  { day: 'Mon', present: 85, absent: 15 },
  { day: 'Tue', present: 92, absent: 8 },
  { day: 'Wed', present: 78, absent: 22 },
  { day: 'Thu', present: 88, absent: 12 },
  { day: 'Fri', present: 75, absent: 25 },
];

const monthlyTrend = [
  { month: 'Sep', rate: 82 },
  { month: 'Oct', rate: 85 },
  { month: 'Nov', rate: 79 },
  { month: 'Dec', rate: 88 },
  { month: 'Jan', rate: 91 },
  { month: 'Feb', rate: 87 },
];

const locationData = [
  { name: 'Classroom', value: 45, color: 'hsl(var(--primary))' },
  { name: 'Library', value: 20, color: 'hsl(var(--info))' },
  { name: 'Cafeteria', value: 15, color: 'hsl(var(--warning))' },
  { name: 'Lab', value: 12, color: 'hsl(var(--success))' },
  { name: 'Other', value: 8, color: 'hsl(var(--muted))' },
];

const statsCards = [
  { title: 'Overall Attendance', value: '87%', change: '+2.5%', trend: 'up', icon: Users },
  { title: 'Avg. Check-in Time', value: '8:52 AM', change: '-3 min', trend: 'up', icon: Clock },
  { title: 'Bunking Incidents', value: '23', change: '-15%', trend: 'up', icon: AlertTriangle },
  { title: 'Active Today', value: '1,245', change: '+45', trend: 'up', icon: Calendar },
];

const Analytics = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-1">Attendance insights and trends</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="glass-panel p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <span className={`flex items-center gap-1 text-xs font-bold ${stat.trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                  {stat.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.title}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Attendance */}
        <div className="glass-panel p-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6">
            Weekly Attendance
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="present" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="absent" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Trend */}
        <div className="glass-panel p-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6">
            Monthly Attendance Rate
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[70, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Location Distribution */}
        <div className="glass-panel p-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6">
            Student Location Distribution
          </h3>
          <div className="flex items-center gap-8">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie
                  data={locationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {locationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {locationData.map((item) => (
                <div key={item.name} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm">{item.name}</span>
                  <span className="text-sm text-muted-foreground ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Peak Hours */}
        <div className="glass-panel p-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6">
            Peak Activity Hours
          </h3>
          <div className="space-y-4">
            {['8:00 - 9:00 AM', '10:00 - 11:00 AM', '2:00 - 3:00 PM', '4:00 - 5:00 PM'].map((time, i) => {
              const percentage = [95, 78, 85, 62][i];
              return (
                <div key={time} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{time}</span>
                    <span className="font-bold">{percentage}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-info rounded-full transition-all duration-1000"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
