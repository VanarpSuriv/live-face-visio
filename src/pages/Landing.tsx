import { useNavigate } from 'react-router-dom';
import { Leaf, ScanFace, Zap, ArrowRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 via-background to-background" />
      
      {/* Radial glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      
      {/* Noise overlay */}
      <div className="absolute inset-0 noise-overlay" />

      <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center gap-6 animate-fade-in-up">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md">
          <Leaf className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Carbon-Neutral Operations</span>
        </div>

        {/* Title */}
        <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
          Eco<span className="text-primary">Track</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl">
          Smart Face Recognition & Movement Tracking System
        </p>

        {/* Feature Badges */}
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <FeatureBadge icon={<ScanFace size={18} />} text="Face Recognition" />
          <FeatureBadge icon={<Zap size={18} />} text="Low-Power AI" />
          <FeatureBadge icon={<Leaf size={18} />} text="Eco-Friendly" />
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-8">
          <Button
            onClick={() => navigate('/login')}
            size="lg"
            className="group px-8 py-6 text-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            Get Started
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
          </Button>

          <Button
            onClick={() => navigate('/team')}
            variant="outline"
            size="lg"
            className="px-8 py-6 text-lg border-white/10 hover:border-primary hover:text-primary"
          >
            Learn More
            <Info className="ml-2" size={20} />
          </Button>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
};

const FeatureBadge = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card/50 border border-white/5 backdrop-blur-sm">
    <span className="text-primary">{icon}</span>
    <span className="text-sm text-foreground">{text}</span>
  </div>
);

export default Landing;
