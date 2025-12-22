import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

type SongCardProps = {
  title: string;
  artist: string;
  emotion: string;
  delay?: number;
  link: string; // Spotify or fallback URL
};

const SongCard = ({
  title,
  artist,
  delay = 0,
  link,
}: SongCardProps) => {
  const spotifyEmbedUrl =
    link && link.includes("open.spotify.com")
      ? link.replace("open.spotify.com/", "open.spotify.com/embed/")
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: -10 }}
      transition={{ delay }}
    >
      <Card variant="glass" className="p-3 w-100 h-40">

        {/* Song info */}
        <h4 className="font-semibold text-sm truncate">{title}</h4>
        <p className="text-xs text-muted-foreground truncate">{artist}</p>

        {/* Spotify Embed or fallback link */}
        {spotifyEmbedUrl ? (
          <iframe
            src={spotifyEmbedUrl}
            width="100%"
            height="100"
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
