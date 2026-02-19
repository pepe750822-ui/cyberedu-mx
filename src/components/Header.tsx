import { Link, useLocation, useNavigate } from "react-router-dom";
import { GraduationCap, LogOut, UserCircle, Sun, Moon, Menu, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import GlobalSearch from "@/components/GlobalSearch";
import { useTheme } from "@/hooks/useTheme";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";
import { useOnlineUsers } from "@/hooks/useOnlineUsers";
import { Users } from "lucide-react";

const Header = () => {
  const { user, profile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const onlineCount = useOnlineUsers();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleAreasClick = (e: React.MouseEvent) => {
    if (location.pathname === "/") {
      e.preventDefault();
      document.getElementById('areas')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

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

        {/* Online Users Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-tight text-emerald-600 dark:text-emerald-400">
            {onlineCount} {onlineCount === 1 ? 'estudiante' : 'estudiantes'} en línea
          </span>
        </div>

        <nav className="flex items-center gap-2 sm:gap-4">
          <div className="hidden md:flex items-center gap-4 mr-2">
            <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Inicio
            </Link>
            <Link
              to="/#areas"
              onClick={handleAreasClick}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Áreas
            </Link>
          </div>

          <GlobalSearch className="hidden md:block" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="transition-colors duration-300">
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Cambiar tema</TooltipContent>
          </Tooltip>

          {user ? (
            <div className="hidden sm:flex items-center gap-3">
              <Avatar className="h-8 w-8">
                {profile?.avatar_url ? (
                  <AvatarImage src={profile.avatar_url} alt={profile.name || "Avatar"} />
                ) : null}
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {(profile?.name || user.email || "U").charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-foreground max-w-[120px] truncate">
                {profile?.name || user.email}
              </span>
              <Button variant="ghost" size="icon" onClick={signOut} title="Cerrar sesión">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="hidden sm:block">
              <Link to="/auth">
                <Button variant="outline" size="sm">
                  <UserCircle className="h-4 w-4 mr-1" />
                  Ingresar
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85%] sm:w-[380px] bg-card/95 backdrop-blur-xl border-l border-border pt-12 overflow-y-auto">
              <SheetHeader className="mb-8">
                <SheetTitle className="text-left flex items-center gap-2">
                  <div className="p-1.5 hero-gradient rounded-lg">
                    <GraduationCap className="h-4 w-4 text-white" />
                  </div>
                  PrepáraTE
                </SheetTitle>
                <div className="flex items-center gap-2 mt-2 px-1">
                  <div className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-tight text-emerald-600 dark:text-emerald-400">
                    {onlineCount} en línea
                  </span>
                </div>
              </SheetHeader>

              <div className="mb-8">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 px-2">Búsqueda Rápida</p>
                <GlobalSearch className="block" />
              </div>

              <div className="flex flex-col gap-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 px-2">Navegación</p>
                  <Link
                    to="/"
                    className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-muted/50 transition-colors text-foreground font-bold"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Inicio
                  </Link>
                  <Link
                    to="/#areas"
                    className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-muted/50 transition-colors text-foreground font-bold"
                    onClick={(e) => {
                      handleAreasClick(e);
                      setIsMenuOpen(false);
                    }}
                  >
                    Áreas de Estudio
                  </Link>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 px-2">Sesión</p>
                  {user ? (
                    <>
                      <div className="flex items-center gap-3 px-3 py-3 bg-muted/30 rounded-lg mb-2">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/20 text-primary">
                            {(profile?.name || user.email || "U").charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm font-bold truncate">{profile?.name || user.email}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                      </div>
                      <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-destructive/10 hover:text-destructive h-12" onClick={() => { signOut(); setIsMenuOpen(false); }}>
                        <LogOut className="h-5 w-5" />
                        Cerrar Sesión
                      </Button>
                    </>
                  ) : (
                    <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="default" className="w-full h-12 font-bold uppercase tracking-widest text-xs">
                        <UserCircle className="h-5 w-5 mr-2" />
                        Ingresar a la Plataforma
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </header>
  );
};

export default Header;
