import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

type SongCardProps = {
  title: string;
  artist: string;
  coverUrl: string;
  emotion: string;
  delay?: number;
  link: string; // Spotify or fallback URL
};

const SongCard = ({
  title,
  artist,
  coverUrl,
  delay = 0,
  link,
}: SongCardProps) => {
  const spotifyEmbedUrl =
    link && link.includes("open.spotify.com")
      ? link.replace("open.spotify.com/", "open.spotify.com/embed/")
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card variant="glass" className="p-3">
        {/* Album art */}
        <img
          src={coverUrl}
          alt={title}
          className="w-full aspect-square object-cover rounded-lg mb-3"
        />

        {/* Song info */}
        <h4 className="font-semibold text-sm truncate">{title}</h4>
        <p className="text-xs text-muted-foreground truncate">{artist}</p>

        {/* Spotify Embed or fallback link */}
        {spotifyEmbedUrl ? (
          <iframe
            src={spotifyEmbedUrl}
            width="100%"
            height="150"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="mt-3 rounded-md"
          />
        ) : (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary underline mt-3 inline-block"
          >
            Play on Spotify
          </a>
        )}
      </Card>
    </motion.div>  );
};

export default SongCard;
