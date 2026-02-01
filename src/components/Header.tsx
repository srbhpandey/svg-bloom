import { Sparkles } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full py-5 px-6">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            IvanPress
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <a 
            href="#" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            How it works
          </a>
          <a 
            href="#" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
