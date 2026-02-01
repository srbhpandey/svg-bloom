import { Shield, Zap, Sliders, Lock } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Client-side processing for instant results',
  },
  {
    icon: Shield,
    title: 'High Quality',
    description: 'Maintains visual fidelity while reducing size',
  },
  {
    icon: Sliders,
    title: 'Full Control',
    description: 'Fine-tune compression with advanced settings',
  },
  {
    icon: Lock,
    title: 'Private & Secure',
    description: 'Files never leave your browser',
  },
];

const FeatureCards = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {features.map((feature) => (
        <div
          key={feature.title}
          className="card-elevated p-5 text-center group hover:scale-[1.02] transition-transform duration-200"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
            <feature.icon className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-foreground mb-1">
            {feature.title}
          </h3>
          <p className="text-xs text-muted-foreground">{feature.description}</p>
        </div>
      ))}
    </div>
  );
};

export default FeatureCards;
