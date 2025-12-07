import { motion } from "framer-motion";
import { Play, Heart, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SongCardProps {
  title: string;
  artist: string;
  coverUrl: string;
  emotion: string;
  delay?: number;
}

const SongCard = ({ title, artist, coverUrl, emotion, delay = 0 }: SongCardProps) => {
  const emotionColors: Record<string, string> = {
    happy: "from-emotion-happy to-orange-500",
    sad: "from-emotion-sad to-blue-700",
    angry: "from-emotion-angry to-red-700",
    surprise: "from-emotion-surprise to-pink-500",
    fear: "from-emotion-fear to-purple-800",
    neutral: "from-emotion-neutral to-gray-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      className="group relative bg-secondary/30 backdrop-blur-xl rounded-2xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-300"
    >
      {/* Cover Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={coverUrl}
          alt={`${title} cover`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="lg"
            className="rounded-full w-14 h-14 bg-primary shadow-lg shadow-primary/50"
          >
            <Play className="w-6 h-6 fill-primary-foreground" />
          </Button>
        </div>

        {/* Emotion Badge */}
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${emotionColors[emotion]} text-white`}>
          {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h4 className="font-display font-semibold truncate">{title}</h4>
        <p className="text-sm text-muted-foreground truncate">{artist}</p>
        
        <div className="flex items-center gap-2 mt-3">
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
            <Heart className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default SongCard;
