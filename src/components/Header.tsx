import { Link } from "react-router-dom";
import { GraduationCap, LogOut, UserCircle, Sun, Moon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import GlobalSearch from "@/components/GlobalSearch";
import { useTheme } from "@/hooks/useTheme";

const Header = () => {
  const { user, profile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border transition-colors duration-300">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="p-1.5 hero-gradient rounded-lg">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-foreground">
            PrepáraTE
          </span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:inline">
            Inicio
          </Link>
          <Link to="/#areas" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:inline">
            Áreas
          </Link>

          <GlobalSearch />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="transition-colors duration-300">
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Cambiar tema</TooltipContent>
          </Tooltip>

          {user ? (
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                {profile?.avatar_url ? (
                  <AvatarImage src={profile.avatar_url} alt={profile.name || "Avatar"} />
                ) : null}
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {(profile?.name || user.email || "U").charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-foreground hidden sm:inline max-w-[120px] truncate">
                {profile?.name || user.email}
              </span>
              <Button variant="ghost" size="icon" onClick={signOut} title="Cerrar sesión">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Link to="/auth">
              <Button variant="outline" size="sm">
                <UserCircle className="h-4 w-4 mr-1" />
                Ingresar
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
