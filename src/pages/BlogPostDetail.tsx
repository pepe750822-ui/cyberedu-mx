import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, User, Tag, Share2, Facebook, Twitter, Link as LinkIcon, ChevronRight } from "lucide-react";
import { blogPosts } from "@/data/blogData";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const BlogPostDetail = () => {
    const { slug } = useParams<{ slug: string }>();
    const post = blogPosts.find((p) => p.slug === slug);

    if (!post) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <h2 className="text-2xl font-bold mb-4 uppercase italic">Artículo no encontrado</h2>
                <Link to="/blog">
                    <Button variant="outline" className="gap-2 font-black uppercase tracking-widest text-[10px]">
                        <ArrowLeft className="h-4 w-4" /> Volver al Blog
                    </Button>
                </Link>
            </div>
        );
    }

    // Related posts (simple filter)
    const relatedPosts = blogPosts.filter(p => p.id !== post.id).slice(0, 2);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />

            {/* Blog Article Header */}
            <article className="pt-10 pb-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">

                        {/* Breadcrumbs */}
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-10">
                            <Link to="/" className="hover:text-primary transition-colors">Inicio</Link>
                            <ChevronRight className="h-3 w-3" />
                            <Link to="/blog" className="hover:text-primary transition-colors">Blog</Link>
                            <ChevronRight className="h-3 w-3" />
                            <span className="text-foreground/50 truncate">Lectura actual</span>
                        </div>

                        <Badge variant="outline" className="mb-6 border-primary/20 bg-primary/10 text-primary uppercase tracking-widest text-[10px] py-1 px-3">
                            {post.category}
                        </Badge>

                        <h1 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter uppercase italic leading-[0.9]">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-10 border-y border-border py-4">
                            <span className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-primary" />
                                {post.date}
                            </span>
                            <span className="flex items-center gap-2">
                                <User className="h-4 w-4 text-primary" />
                                Por {post.author}
                            </span>
                            <div className="ml-auto flex items-center gap-3">
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-muted/50">
                                    <Facebook className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-muted/50">
                                    <Twitter className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-muted/50">
                                    <LinkIcon className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="aspect-video w-full rounded-[2.5rem] overflow-hidden border border-border shadow-2xl mb-12">
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Post Content */}
                        <div
                            className="prose prose-invert prose-emerald max-w-none 
                prose-h2:text-2xl prose-h2:font-black prose-h2:uppercase prose-h2:italic prose-h2:tracking-tight prose-h2:mt-12
                prose-h3:text-xl prose-h3:font-black prose-h3:uppercase prose-h3:italic prose-h3:tracking-tight prose-h3:mt-8
                prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:text-lg
                prose-li:text-muted-foreground prose-li:text-lg
                prose-strong:text-foreground prose-strong:font-black
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              "
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        <Separator className="my-16" />

                        {/* Tags */}
                        <div className="flex items-center gap-4 mb-10">
                            <Tag className="h-4 w-4 text-primary" />
                            <div className="flex flex-wrap gap-2">
                                {post.tags.map(tag => (
                                    <Badge key={tag} variant="secondary" className="bg-muted hover:bg-muted/80 text-[10px] uppercase font-bold px-3 py-1">
                                        #{tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Related Posts */}
                        <div className="bg-muted/30 rounded-[2.5rem] p-8 md:p-12">
                            <h3 className="text-xl font-black uppercase italic tracking-tighter mb-8">También te puede interesar</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {relatedPosts.map(rp => (
                                    <Link key={rp.id} to={`/blog/${rp.slug}`} className="group flex flex-col gap-4">
                                        <div className="aspect-video rounded-3xl overflow-hidden border border-border">
                                            <img src={rp.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={rp.title} />
                                        </div>
                                        <h4 className="font-black text-sm uppercase italic leading-tight group-hover:text-primary transition-colors">{rp.title}</h4>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </article>

            <Footer />
        </div>
    );
};

export default BlogPostDetail;
