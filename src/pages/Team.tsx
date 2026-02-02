import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Github, Linkedin, Mail } from 'lucide-react';

const teamMembers = [
  {
    name: "Modhini",
    role: "Frontend Developer",
    avatar: "M",
    color: "bg-primary",
  },
  {
    name: "Vanarp Suriv",
    role: "Backend Developer",
    avatar: "V",
    color: "bg-info",
  },
  {
    name: "Team Member 3",
    role: "AI/ML Engineer",
    avatar: "T",
    color: "bg-warning",
  },
  {
    name: "Team Member 4",
    role: "Database Architect",
    avatar: "T",
    color: "bg-success",
  },
];

const Team = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-8 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 via-background to-background" />
      
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to home</span>
        </button>

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Meet the <span className="text-primary">Team</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The brilliant minds behind EcoTrack's smart campus solution
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="glass-panel p-6 text-center hover:border-primary/50 transition-all duration-300 group"
            >
              <div className={`w-20 h-20 ${member.color} rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                {member.avatar}
              </div>
              <h3 className="text-lg font-bold mb-1">{member.name}</h3>
              <p className="text-muted-foreground text-sm mb-4">{member.role}</p>
              <div className="flex justify-center gap-3">
                <button className="p-2 bg-card hover:bg-primary/20 rounded-lg transition-colors">
                  <Github size={18} className="text-muted-foreground hover:text-primary" />
                </button>
                <button className="p-2 bg-card hover:bg-primary/20 rounded-lg transition-colors">
                  <Linkedin size={18} className="text-muted-foreground hover:text-primary" />
                </button>
                <button className="p-2 bg-card hover:bg-primary/20 rounded-lg transition-colors">
                  <Mail size={18} className="text-muted-foreground hover:text-primary" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Project Info */}
        <div className="mt-16 glass-panel p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">About EcoTrack</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            EcoTrack is a smart campus attendance and movement tracking system that uses 
            AI-powered face recognition to monitor student presence in real-time. 
            Built with sustainability in mind, our system operates on low-power AI models 
            while maintaining carbon-neutral operations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Team;
