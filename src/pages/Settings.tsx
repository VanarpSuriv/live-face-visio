import { Bell, Shield, Mail, Monitor, Database, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated",
    });
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Configure system preferences and notifications</p>
      </div>

      {/* Notification Settings */}
      <div className="glass-panel p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Bell className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-bold">Notifications</h2>
            <p className="text-sm text-muted-foreground">Configure alert preferences</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-white/10">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">Receive alerts via email</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between py-3 border-b border-white/10">
            <div>
              <p className="font-medium">SMS Alerts</p>
              <p className="text-sm text-muted-foreground">Send SMS for bunking incidents</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium">Desktop Notifications</p>
              <p className="text-sm text-muted-foreground">Browser push notifications</p>
            </div>
            <Switch />
          </div>
        </div>
      </div>

      {/* Backend Configuration */}
      <div className="glass-panel p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-info/10 rounded-lg">
            <Database className="h-5 w-5 text-info" />
          </div>
          <div>
            <h2 className="font-bold">Backend Configuration</h2>
            <p className="text-sm text-muted-foreground">Connect to face recognition server</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Server URL</Label>
            <Input
              placeholder="http://localhost:5001"
              className="bg-background/50 border-white/10"
            />
          </div>
          <div className="space-y-2">
            <Label>WebSocket Port</Label>
            <Input
              placeholder="5001"
              className="bg-background/50 border-white/10"
            />
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium">Auto-reconnect</p>
              <p className="text-sm text-muted-foreground">Automatically reconnect on disconnect</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </div>

      {/* Email Settings */}
      <div className="glass-panel p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-warning/10 rounded-lg">
            <Mail className="h-5 w-5 text-warning" />
          </div>
          <div>
            <h2 className="font-bold">Email Configuration</h2>
            <p className="text-sm text-muted-foreground">SMTP settings for alerts</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>SMTP Server</Label>
            <Input
              placeholder="smtp.gmail.com"
              className="bg-background/50 border-white/10"
            />
          </div>
          <div className="space-y-2">
            <Label>Port</Label>
            <Input
              placeholder="587"
              className="bg-background/50 border-white/10"
            />
          </div>
          <div className="space-y-2">
            <Label>Sender Email</Label>
            <Input
              type="email"
              placeholder="alerts@svce.ac.in"
              className="bg-background/50 border-white/10"
            />
          </div>
          <div className="space-y-2">
            <Label>App Password</Label>
            <Input
              type="password"
              placeholder="••••••••••••"
              className="bg-background/50 border-white/10"
            />
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="glass-panel p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-destructive/10 rounded-lg">
            <Shield className="h-5 w-5 text-destructive" />
          </div>
          <div>
            <h2 className="font-bold">Security</h2>
            <p className="text-sm text-muted-foreground">Authentication and access control</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-white/10">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">Add extra security to your account</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium">Session Timeout</p>
              <p className="text-sm text-muted-foreground">Auto logout after inactivity</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" className="border-white/10">
          Cancel
        </Button>
        <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default Settings;
