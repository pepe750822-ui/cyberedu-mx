import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, User, ChevronRight, Search, Tag, Newspaper } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const blogPosts = [
    {
        id: "guia-definitiva-unam-2026",
        title: "Guía Definitiva UNAM 2026: Todo lo que necesitas saber",
        excerpt: "Descubre los cambios clave en el examen de ingreso a la UNAM para el 2026 y cómo prepararte de manera efectiva.",
        date: "20 Feb 2026",
        author: "CyberEdu MX",
        category: "Guías de Estudio",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop",
        slug: "guia-unam-2026"
    },
    {
        id: "tecnicas-estudio-examen-linea",
        title: "5 Técnicas de Estudio para Exámenes en Línea",
        excerpt: "Aprende a dominar los exámenes digitales con estas estrategias probadas de concentración y gestión del tiempo.",
        date: "15 Feb 2026",
        author: "Admin",
        category: "Tips",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop",
        slug: "tecnicas-estudio-digital"
    },
    {
        id: "novedades-ecoems-2026",
        title: "Novedades del Examen ECOEMS 2026",
        excerpt: "Analizamos el nuevo temario oficial del ECOEMS y cómo impacta en tu rutina de estudio este año.",
        date: "10 Feb 2026",
        author: "Coordinación Académica",
        category: "Noticias",
        image: "https://images.unsplash.com/photo-1454165833762-0102409830e7?q=80&w=800&auto=format&fit=crop",
        slug: "noticias-ecoems"
    }
];

const Blog = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredPosts = blogPosts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />

            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 -z-10" />
                <div className="container mx-auto px-4 text-center">
                    <Badge variant="outline" className="mb-4 border-primary/20 bg-primary/10 text-primary uppercase tracking-widest text-[10px] py-1 px-3">
                        Explora el Conocimiento
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter uppercase italic leading-[0.9]">
                        Blog de <span className="text-primary italic">Noticias</span> & Guías
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
                        Mantente al día con las últimas novedades del examen UNAM, ECOEMS y los mejores consejos de estudio.
                    </p>

                    <div className="max-w-xl mx-auto relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar artículos o temas..."
                            className="pl-12 h-14 rounded-2xl border-border bg-card shadow-lg"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </section>

            {/* Blog Grid */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPosts.map((post) => (
                            <article key={post.id} className="group bg-card rounded-3xl border border-border overflow-hidden hover:border-primary/30 transition-all shadow-sm hover:shadow-xl hover:-translate-y-1">
                                <div className="aspect-video overflow-hidden relative">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <Badge className="bg-background/80 backdrop-blur-md text-foreground border-border text-[9px] uppercase tracking-widest px-2 py-1">
                                            {post.category}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="p-8">
                                    <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-4">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {post.date}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <User className="h-3 w-3" />
                                            {post.author}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-black mb-4 group-hover:text-primary transition-colors leading-tight uppercase italic">
                                        {post.title}
                                    </h3>
                                    <p className="text-muted-foreground text-sm mb-6 line-clamp-2">
                                        {post.excerpt}
                                    </p>
                                    <Button variant="ghost" className="p-0 h-auto font-black text-[10px] uppercase tracking-widest hover:bg-transparent group/btn">
                                        Leer más
                                        <ChevronRight className="h-3 w-3 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                    </Button>
                                </div>
                            </article>
                        ))}
                    </div>

                    {filteredPosts.length === 0 && (
                        <div className="text-center py-20">
                            <Newspaper className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                            <p className="text-muted-foreground font-medium">No encontramos artículos que coincidan con tu búsqueda.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-3xl mx-auto bg-gradient-to-br from-primary to-indigo-600 rounded-[3rem] p-12 text-white shadow-2xl shadow-primary/20">
                        <h2 className="text-3xl font-black mb-6 uppercase italic tracking-tighter">¿Quieres recibir las últimas noticias en tu correo?</h2>
                        <p className="text-white/80 mb-8 font-medium">Únete a más de 10,000 estudiantes y obtén material exclusivo semanalmente.</p>
                        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                            <Input placeholder="Tu correo electrónico" className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-12 rounded-2xl" />
                            <Button className="bg-white text-primary hover:bg-white/90 h-12 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px]">
                                Suscribirme
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Blog;
