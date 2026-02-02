import { useState } from 'react';
import { Search, Plus, Edit, Trash2, UserPlus, GraduationCap, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface Student {
  id: string;
  name: string;
  registrationNo: string;
  email: string;
  phone: string;
  department: string;
  year: number;
  facultyAdvisor: string;
}

const initialStudents: Student[] = [
  { id: '1', name: 'Pranav A', registrationNo: 'CS2024001', email: 'pranav.a@svce.ac.in', phone: '+91 9876543210', department: 'Computer Science', year: 2, facultyAdvisor: 'Mr. Arun' },
  { id: '2', name: 'Suresh', registrationNo: 'CS2024002', email: 'suresh@svce.ac.in', phone: '+91 9876543211', department: 'Computer Science', year: 2, facultyAdvisor: 'Mr. Arun' },
  { id: '3', name: 'Modhini', registrationNo: 'EC2024001', email: 'modhini@svce.ac.in', phone: '+91 9876543212', department: 'Electronics', year: 3, facultyAdvisor: 'Dr. Sharon' },
  { id: '4', name: 'Rishe', registrationNo: 'ME2024001', email: 'rishe@svce.ac.in', phone: '+91 9876543213', department: 'Mechanical', year: 1, facultyAdvisor: 'Dr. Sharon' },
  { id: '5', name: 'Shivvani', registrationNo: 'CS2024003', email: 'shivvani@svce.ac.in', phone: '+91 9876543214', department: 'Computer Science', year: 4, facultyAdvisor: 'Mr. Arun' },
  { id: '6', name: 'Srivatsan', registrationNo: 'CS2024004', email: 'srivatsan@svce.ac.in', phone: '+91 9876543215', department: 'Computer Science', year: 2, facultyAdvisor: 'Dr. Sharon' },
];

const StudentManagement = () => {
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newStudent, setNewStudent] = useState<Partial<Student>>({});

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.registrationNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.facultyAdvisor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStudent = () => {
    if (newStudent.name && newStudent.registrationNo) {
      const student: Student = {
        id: Date.now().toString(),
        name: newStudent.name,
        registrationNo: newStudent.registrationNo,
        email: newStudent.email || '',
        phone: newStudent.phone || '',
        department: newStudent.department || '',
        year: newStudent.year || 1,
        facultyAdvisor: newStudent.facultyAdvisor || '',
      };
      setStudents(prev => [student, ...prev]);
      setNewStudent({});
      setIsAddOpen(false);
      toast({
        title: "Student Added",
        description: `${student.name} has been added successfully`,
      });
    }
  };

  const handleDeleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    toast({
      title: "Student Removed",
      description: "Student record has been deleted",
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Management</h1>
          <p className="text-muted-foreground mt-1">Manage student records and information</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-white/10">
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  value={newStudent.name || ''}
                  onChange={(e) => setNewStudent(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-background/50 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label>Registration Number</Label>
                <Input
                  value={newStudent.registrationNo || ''}
                  onChange={(e) => setNewStudent(prev => ({ ...prev, registrationNo: e.target.value }))}
                  className="bg-background/50 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={newStudent.email || ''}
                  onChange={(e) => setNewStudent(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-background/50 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Input
                  value={newStudent.department || ''}
                  onChange={(e) => setNewStudent(prev => ({ ...prev, department: e.target.value }))}
                  className="bg-background/50 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label>Faculty Advisor</Label>
                <Input
                  value={newStudent.facultyAdvisor || ''}
                  onChange={(e) => setNewStudent(prev => ({ ...prev, facultyAdvisor: e.target.value }))}
                  className="bg-background/50 border-white/10"
                  placeholder="e.g. Mr. Arun or Dr. Sharon"
                />
              </div>
              <Button onClick={handleAddStudent} className="w-full bg-primary hover:bg-primary/90">
                Add Student
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, ID, or faculty advisor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-background/50 border-white/10"
        />
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <div key={student.id} className="glass-panel p-6 hover:border-primary/30 transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                  {student.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold">{student.name}</h3>
                  <p className="text-xs text-muted-foreground font-mono">{student.registrationNo}</p>
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10">
                  <Edit className="h-4 w-4 text-muted-foreground" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-destructive/10"
                  onClick={() => handleDeleteStudent(student.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <GraduationCap className="h-4 w-4" />
                <span>{student.department} • Year {student.year}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span className="truncate">{student.email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{student.phone}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-xs text-muted-foreground">
                Faculty Advisor: <span className="text-primary font-medium">{student.facultyAdvisor}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentManagement;
