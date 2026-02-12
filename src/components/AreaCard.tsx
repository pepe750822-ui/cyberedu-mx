import { Link } from "react-router-dom";
import { PlayCircle } from "lucide-react";
import type { Area } from "@/data/areas";

interface AreaCardProps {
  area: Area;
  index: number;
}

const AreaCard = ({ area, index }: AreaCardProps) => {
  const Icon = area.icon;

  return (
    <Link
      to={`/area/${area.id}`}
      className="group relative overflow-hidden rounded-xl card-shadow hover:card-hover-shadow transition-all duration-300 hover:-translate-y-1"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className={`${area.gradientClass} p-6 h-full min-h-[200px] flex flex-col justify-between text-white`}>
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-white/20 rounded-lg backdrop-blur-sm">
              <Icon className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
              {area.videoCount} videos
            </span>
          </div>
          <h3 className="text-xl font-bold mb-2">{area.name}</h3>
          <p className="text-sm text-white/80 leading-relaxed">{area.description}</p>
        </div>
        <div className="flex items-center gap-2 mt-4 text-sm font-medium text-white/90 group-hover:text-white transition-colors">
          <PlayCircle className="h-5 w-5" />
          <span>Comenzar a estudiar</span>
        </div>
      </div>
    </Link>
  );
};

export default AreaCard;
