import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="p-1.5 hero-gradient rounded-lg">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-foreground">
            PrepáraTE
          </span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Inicio
          </Link>
          <Link to="/#areas" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Áreas
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
