import { PlayCircle, Clock, CheckCircle2 } from "lucide-react";
import type { Video } from "@/data/areas";
import { materiales } from "@/data/materialComplementario";

interface VideoCardProps {
  video: Video;
  index: number;
  isActive: boolean;
  isViewed?: boolean;
  onClick: () => void;
}

const VideoCard = ({ video, index, isActive, isViewed, onClick }: VideoCardProps) => {
  const tieneQuiz = !!materiales[video.id]?.quiz;
  const quizAprobado = typeof window !== 'undefined' && localStorage.getItem(`quiz_aprobado_${video.id}`) === 'true';
  const completo = !tieneQuiz ? !!isViewed : (!!isViewed && quizAprobado);

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-lg transition-all duration-200 border relative ${
        isActive
          ? "bg-primary/10 border-primary/30 shadow-sm"
          : "bg-card border-border hover:bg-muted/50 hover:border-primary/20"
      }`}
    >
      {completo && (
        <CheckCircle2 className="absolute top-2 right-2 h-5 w-5 text-green-500" />
      )}
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
          isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        }`}>
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={`font-semibold text-sm mb-1 ${isActive ? "text-primary" : "text-foreground"}`}>
            {video.title}
          </h4>
          <p className="text-xs text-muted-foreground line-clamp-2">{video.description}</p>
          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{video.duration}</span>
          </div>
        </div>
        <PlayCircle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
      </div>
    </button>
  );
};

export default VideoCard;
