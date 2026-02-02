import { User, Mail, Phone, MapPin, Calendar, Shield, Camera, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Profile = () => {
  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your account information</p>
      </div>

      {/* Profile Card */}
      <div className="glass-panel p-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Avatar */}
          <div className="relative">
            <div className="w-32 h-32 rounded-2xl bg-primary/20 flex items-center justify-center text-4xl font-bold text-primary">
              A
            </div>
            <button className="absolute -bottom-2 -right-2 p-2 bg-primary rounded-full hover:bg-primary/90 transition-colors">
              <Camera className="h-4 w-4 text-primary-foreground" />
            </button>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-bold">Administrator</h2>
              <p className="text-muted-foreground">System Administrator</p>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                admin@svce.ac.in
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                Chennai, India
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Joined Jan 2024
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                <Shield className="h-3 w-3 inline mr-1" />
                Super Admin
              </span>
              <span className="px-3 py-1 bg-success/10 text-success text-xs font-bold rounded-full">
                Verified
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="glass-panel p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-bold">Personal Information</h2>
              <p className="text-sm text-muted-foreground">Update your personal details</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="border-white/10">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input
              defaultValue="Administrator"
              className="bg-background/50 border-white/10"
            />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              defaultValue="admin@svce.ac.in"
              className="bg-background/50 border-white/10"
            />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input
              defaultValue="+91 9876543210"
              className="bg-background/50 border-white/10"
            />
          </div>
          <div className="space-y-2">
            <Label>Department</Label>
            <Input
              defaultValue="IT Administration"
              className="bg-background/50 border-white/10"
            />
          </div>
        </div>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-6 text-center">
          <p className="text-4xl font-bold text-primary">156</p>
          <p className="text-sm text-muted-foreground mt-1">Total Sessions</p>
        </div>
        <div className="glass-panel p-6 text-center">
          <p className="text-4xl font-bold text-info">42</p>
          <p className="text-sm text-muted-foreground mt-1">Reports Generated</p>
        </div>
        <div className="glass-panel p-6 text-center">
          <p className="text-4xl font-bold text-success">98%</p>
          <p className="text-sm text-muted-foreground mt-1">Uptime</p>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" className="border-white/10">
          Cancel
        </Button>
        <Button className="bg-primary hover:bg-primary/90">
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default Profile;
