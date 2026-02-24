import { Link, useLocation, useNavigate } from "react-router-dom";
import { GraduationCap, LogOut, UserCircle, Sun, Moon, Menu, Search, BookOpen, ShoppingCart, ExternalLink, Mail, Award, Newspaper } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ProfileDialog } from "./ProfileDialog";
import { Settings } from "lucide-react";
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
            <a
              href="https://cyberedumx.com/libro/manual_digital_ECOEMS.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <BookOpen className="h-3.5 w-3.5" />
              Manual
            </a>
            <Link
              to="/certificaciones"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <Award className="h-3.5 w-3.5" />
              Certificados
            </Link>
            <Link
              to="/blog"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <Newspaper className="h-3.5 w-3.5" />
              Blog
            </Link>
            <a
              href="https://www.udemy.com/course/ecoems2026conia/?referralCode=B2F05026985A2564FAAC"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-emerald-500 hover:text-emerald-400 transition-colors flex items-center gap-1 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 hover:border-emerald-500/40"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              Curso Udemy
              <ExternalLink className="h-3 w-3" />
            </a>
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

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => navigate("/marketing")} className="transition-colors duration-300">
                <Mail className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Marketing y Notificaciones</TooltipContent>
          </Tooltip>

          {user ? (
            <div className="hidden sm:flex items-center gap-3">
              <ProfileDialog>
                <button className="flex items-center gap-3 hover:opacity-80 transition-opacity outline-none">
                  <Avatar className="h-8 w-8 border border-primary/20">
                    <AvatarImage src={localStorage.getItem('user_avatar') || profile?.avatar_url || ""} />
                    <AvatarFallback className="text-xs bg-primary/10 text-primary uppercase">
                      {(localStorage.getItem('user_display_name') || profile?.name || user.email || "U").charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-black text-foreground max-w-[120px] truncate uppercase tracking-tighter">
                    {localStorage.getItem('user_display_name') || profile?.name || user.email?.split('@')[0]}
                  </span>
                </button>
              </ProfileDialog>
              <Button variant="ghost" size="icon" onClick={signOut} title="Cerrar sesión" className="text-muted-foreground hover:text-destructive">
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
                  <a
                    href="https://cyberedumx.com/libro/manual_digital_ECOEMS.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-muted/50 transition-colors text-foreground font-bold"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <BookOpen className="h-5 w-5 text-amber-500" />
                    Manual Digital ECOEMS
                  </a>
                  <Link
                    to="/certificaciones"
                    className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-muted/50 transition-colors text-foreground font-bold"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Award className="h-5 w-5 text-amber-500" />
                    Mis Certificaciones
                  </Link>
                  <Link
                    to="/blog"
                    className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-muted/50 transition-colors text-foreground font-bold"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Newspaper className="h-5 w-5 text-amber-500" />
                    Blog de Noticias
                  </Link>
                  <Link
                    to="/marketing"
                    className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-muted/50 transition-colors text-foreground font-bold"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Mail className="h-5 w-5 text-indigo-400" />
                    Notificaciones y Marketing
                  </Link>
                  <a
                    href="https://www.udemy.com/course/ecoems2026conia/?referralCode=B2F05026985A2564FAAC"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-3 py-3 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors text-emerald-500 font-bold border border-emerald-500/20"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ShoppingCart className="h-5 w-5 text-emerald-500" />
                    Curso Udemy – 128 Preguntas
                    <ExternalLink className="h-4 w-4 ml-auto" />
                  </a>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 px-2">Sesión</p>
                  {user ? (
                    <>
                      <div className="p-4 bg-muted/30 rounded-3xl mb-4 border border-white/5">
                        <div className="flex items-center gap-4 mb-4">
                          <Avatar className="h-12 w-12 border-2 border-primary/20">
                            <AvatarImage src={localStorage.getItem('user_avatar') || profile?.avatar_url || ""} />
                            <AvatarFallback className="bg-primary/20 text-primary">
                              {(localStorage.getItem('user_display_name') || profile?.name || user.email || "U").charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-base font-black truncate uppercase tracking-tighter">
                              {localStorage.getItem('user_display_name') || profile?.name || user.email?.split('@')[0]}
                            </p>
                            <p className="text-[10px] text-muted-foreground truncate font-bold uppercase tracking-widest">{user.email}</p>
                          </div>
                        </div>

                        <ProfileDialog>
                          <Button variant="outline" className="w-full h-12 rounded-2xl gap-2 font-black uppercase tracking-widest text-[10px] bg-white/5 border-white/10">
                            <Settings className="h-4 w-4" />
                            Personalizar Perfil
                          </Button>
                        </ProfileDialog>
                      </div>

                      <Button variant="ghost" className="w-full justify-start gap-4 hover:bg-destructive/10 hover:text-destructive h-14 rounded-2xl font-black uppercase tracking-widest text-xs px-6" onClick={() => { signOut(); setIsMenuOpen(false); }}>
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
