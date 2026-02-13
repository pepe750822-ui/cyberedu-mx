import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Video, BookOpen } from "lucide-react";
import { areas } from "@/data/areas";
import { getNotebookUrl } from "@/data/notebookMap";
import VideoCard from "@/components/VideoCard";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";

const AreaDetail = () => {
  const { areaId } = useParams<{ areaId: string }>();
  const area = areas.find((a) => a.id === areaId);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [showNotebook, setShowNotebook] = useState(false);

  if (!area) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Área no encontrada</h1>
          <Link to="/" className="text-primary hover:underline">Volver al inicio</Link>
        </div>
      </div>
    );
  }

  const Icon = area.icon;
  const activeVideo = area.videos[activeVideoIndex];
  const notebookUrl = getNotebookUrl(activeVideo.id);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Area Header */}
      <div className={`${area.gradientClass} text-white`}>
        <div className="container mx-auto px-4 py-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a áreas
          </Link>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Icon className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold">{area.name}</h1>
              <p className="text-white/80 mt-1">{area.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player + Notebook */}
          <div className="lg:col-span-2 space-y-4">
            {/* Toggle buttons */}
            {notebookUrl && (
              <div className="flex gap-2">
                <Button
                  variant={!showNotebook ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowNotebook(false)}
                >
                  <Video className="h-4 w-4 mr-1" />
                  Video
                </Button>
                <Button
                  variant={showNotebook ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowNotebook(true)}
                >
                  <BookOpen className="h-4 w-4 mr-1" />
                  Abrir Notebook
                </Button>
              </div>
            )}

            <div className="bg-card rounded-xl border border-border overflow-hidden card-shadow">
              {showNotebook && notebookUrl ? (
                <div className="aspect-video">
                  <iframe
                    src={notebookUrl}
                    title={`Notebook - ${activeVideo.title}`}
                    className="w-full h-full"
                    allow="clipboard-write"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-foreground/5 flex items-center justify-center">
                  {activeVideo.videoUrl ? (
                    <iframe
                      src={activeVideo.videoUrl}
                      title={activeVideo.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="text-center p-8">
                      <Video className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
                      <p className="text-muted-foreground font-medium">Video próximamente</p>
                      <p className="text-sm text-muted-foreground/70 mt-1">
                        Agrega la URL del video en el archivo de datos
                      </p>
                    </div>
                  )}
                </div>
              )}
              <div className="p-6">
                <h2 className="text-xl font-bold text-foreground mb-2">{activeVideo.title}</h2>
                <p className="text-muted-foreground">{activeVideo.description}</p>
              </div>
            </div>
          </div>

          {/* Video List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-foreground">Lista de videos</h3>
              <span className="text-sm text-muted-foreground">{area.videoCount} videos</span>
            </div>
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {area.videos.map((video, index) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  index={index}
                  isActive={index === activeVideoIndex}
                  onClick={() => {
                    setActiveVideoIndex(index);
                    setShowNotebook(false);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AreaDetail;
