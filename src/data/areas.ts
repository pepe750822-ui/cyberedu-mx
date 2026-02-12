import { BookOpen, Calculator, Microscope, FlaskConical, Atom, Globe2, MapPin, Landmark, Scale, Brain } from "lucide-react";

export interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string; // YouTube embed URL or video file URL
  duration: string;
}

export interface Area {
  id: string;
  name: string;
  description: string;
  icon: typeof BookOpen;
  gradientClass: string;
  videoCount: number;
  videos: Video[];
}

export const areas: Area[] = [
  {
    id: "espanol",
    name: "Español",
    description: "Comprensión lectora, gramática, ortografía y redacción",
    icon: BookOpen,
    gradientClass: "area-gradient-1",
    videoCount: 9,
    videos: Array.from({ length: 9 }, (_, i) => ({
      id: `espanol-${i + 1}`,
      title: `Español - Tema ${i + 1}`,
      description: `Video ${i + 1} del área de Español`,
      videoUrl: "",
      duration: "15:00",
    })),
  },
  {
    id: "matematicas",
    name: "Matemáticas",
    description: "Álgebra, aritmética, geometría y estadística",
    icon: Calculator,
    gradientClass: "area-gradient-2",
    videoCount: 9,
    videos: Array.from({ length: 9 }, (_, i) => ({
      id: `matematicas-${i + 1}`,
      title: `Matemáticas - Tema ${i + 1}`,
      description: `Video ${i + 1} del área de Matemáticas`,
      videoUrl: "",
      duration: "18:00",
    })),
  },
  {
    id: "biologia",
    name: "Biología",
    description: "Célula, genética, evolución y ecología",
    icon: Microscope,
    gradientClass: "area-gradient-3",
    videoCount: 9,
    videos: Array.from({ length: 9 }, (_, i) => ({
      id: `biologia-${i + 1}`,
      title: `Biología - Tema ${i + 1}`,
      description: `Video ${i + 1} del área de Biología`,
      videoUrl: "",
      duration: "16:00",
    })),
  },
  {
    id: "quimica",
    name: "Química",
    description: "Tabla periódica, reacciones y enlaces químicos",
    icon: FlaskConical,
    gradientClass: "area-gradient-4",
    videoCount: 9,
    videos: Array.from({ length: 9 }, (_, i) => ({
      id: `quimica-${i + 1}`,
      title: `Química - Tema ${i + 1}`,
      description: `Video ${i + 1} del área de Química`,
      videoUrl: "",
      duration: "14:00",
    })),
  },
  {
    id: "fisica",
    name: "Física",
    description: "Mecánica, energía, ondas y electricidad",
    icon: Atom,
    gradientClass: "area-gradient-5",
    videoCount: 9,
    videos: Array.from({ length: 9 }, (_, i) => ({
      id: `fisica-${i + 1}`,
      title: `Física - Tema ${i + 1}`,
      description: `Video ${i + 1} del área de Física`,
      videoUrl: "",
      duration: "17:00",
    })),
  },
  {
    id: "historia-universal",
    name: "Historia Universal",
    description: "Civilizaciones, guerras mundiales y globalización",
    icon: Globe2,
    gradientClass: "area-gradient-6",
    videoCount: 9,
    videos: Array.from({ length: 9 }, (_, i) => ({
      id: `historia-universal-${i + 1}`,
      title: `Historia Universal - Tema ${i + 1}`,
      description: `Video ${i + 1} del área de Historia Universal`,
      videoUrl: "",
      duration: "20:00",
    })),
  },
  {
    id: "historia-mexico",
    name: "Historia de México",
    description: "Época prehispánica, Independencia, Revolución y México moderno",
    icon: Landmark,
    gradientClass: "area-gradient-7",
    videoCount: 9,
    videos: Array.from({ length: 9 }, (_, i) => ({
      id: `historia-mexico-${i + 1}`,
      title: `Historia de México - Tema ${i + 1}`,
      description: `Video ${i + 1} del área de Historia de México`,
      videoUrl: "",
      duration: "19:00",
    })),
  },
  {
    id: "geografia",
    name: "Geografía",
    description: "Cartografía, climas, recursos naturales y población",
    icon: MapPin,
    gradientClass: "area-gradient-8",
    videoCount: 9,
    videos: Array.from({ length: 9 }, (_, i) => ({
      id: `geografia-${i + 1}`,
      title: `Geografía - Tema ${i + 1}`,
      description: `Video ${i + 1} del área de Geografía`,
      videoUrl: "",
      duration: "15:00",
    })),
  },
  {
    id: "formacion-civica",
    name: "Formación Cívica y Ética",
    description: "Derechos humanos, democracia y valores",
    icon: Scale,
    gradientClass: "area-gradient-9",
    videoCount: 9,
    videos: Array.from({ length: 9 }, (_, i) => ({
      id: `formacion-civica-${i + 1}`,
      title: `Formación Cívica - Tema ${i + 1}`,
      description: `Video ${i + 1} del área de Formación Cívica y Ética`,
      videoUrl: "",
      duration: "13:00",
    })),
  },
  {
    id: "habilidades",
    name: "Habilidad Verbal y Matemática",
    description: "Razonamiento lógico, analogías y series numéricas",
    icon: Brain,
    gradientClass: "area-gradient-10",
    videoCount: 9,
    videos: Array.from({ length: 9 }, (_, i) => ({
      id: `habilidades-${i + 1}`,
      title: `Habilidades - Tema ${i + 1}`,
      description: `Video ${i + 1} del área de Habilidad Verbal y Matemática`,
      videoUrl: "",
      duration: "16:00",
    })),
  },
];
