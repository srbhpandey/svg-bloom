import Header from '@/components/Header';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

type ButtonVariant = 'link' | 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost';

interface Plan {
  name: string;
  price: string;
  period: string;
  features: string[];
  buttonText: string;
  buttonVariant: ButtonVariant;
}

const plans: Plan[] = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    features: ['Basic vectorization', 'Up to 5 images per month', 'Community support'],
    buttonText: 'Start Free',
    buttonVariant: 'default',
  },
  {
    name: 'Pro',
    price: '$9.99',
    period: '/month',
    features: ['Unlimited vectorization', 'Priority processing', 'Email support'],
    buttonText: 'Upgrade to Pro',
    buttonVariant: 'default',
  },
  {
    name: 'Business',
    price: '$29.99',
    period: '/month',
    features: ['Team accounts', 'Dedicated support', 'Custom integrations'],
    buttonText: 'Contact Sales',
    buttonVariant: 'default',
  },
];

const MotionCard = motion(Card);

const Pricing = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex flex-col items-center px-4 py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-8 tracking-tight">
          Pricing
        </h1>
        <div className="grid w-full max-w-5xl gap-6 md:grid-cols-3">
          {plans.map((plan, index) => (
            <MotionCard
              key={plan.name}
              className="flex flex-col bg-card shadow-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-semibold text-foreground">
                  {plan.name}
                </CardTitle>
                <p className="text-4xl font-bold text-primary">
                  {plan.price}
                  <span className="text-base font-medium text-foreground">
                    {plan.period}
                  </span>
                </p>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2 text-foreground">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <span className="mr-2 text-primary">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button asChild variant={plan.buttonVariant}>
                  <Link to="#">{plan.buttonText}</Link>
                </Button>
              </CardFooter>
            </MotionCard>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Pricing;
