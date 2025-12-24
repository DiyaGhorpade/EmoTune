import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

type SongCardProps = {
  title: string;
  artist: string;
  emotion: string;
  delay?: number;
  link: string;
};

const SongCard = ({
  title,
  artist,
  emotion,
  delay = 0,
  link,
}: SongCardProps) => {
  const [isFav, setIsFav] = useState(false);

  const spotifyEmbedUrl =
    link && link.includes("open.spotify.com")
      ? link.replace("open.spotify.com/", "open.spotify.com/embed/")
      : null;

  // Load favorites from localStorage
  const getFavorites = () => {
    try {
      const favs = localStorage.getItem("favourites");
      return favs ? JSON.parse(favs) : [];
    } catch {
      return [];
    }
  };

  // Save favorites to localStorage
  const saveFavorites = (favorites: any[]) => {
    localStorage.setItem("favourites", JSON.stringify(favorites));
  };

  // Check if this song is favorited on load
  useEffect(() => {
    const favorites = getFavorites();
    const isAlreadyFav = favorites.some((fav: any) => fav.link === link);
    setIsFav(isAlreadyFav);
  }, [link]);

  const toggleFavourite = () => {
    const favorites = getFavorites();

    if (isFav) {
      // Remove from favorites
      const updated = favorites.filter((fav: any) => fav.link !== link);
      saveFavorites(updated);
      setIsFav(false);
      console.log("✅ Removed from favorites");
    } else {
      // Add to favorites
      const newFav = {
        title,
        artist,
        emotion,
        link,
        addedAt: new Date().toISOString(),
      };
      favorites.push(newFav);
      saveFavorites(favorites);
      setIsFav(true);
      console.log("✅ Added to favorites");
    }

    // Dispatch custom event so Favourites page updates
    window.dispatchEvent(new Event("favoritesUpdated"));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: -10 }}
      transition={{ delay }}
    >
      <Card variant="glass" className="p-3 w-100 h-40 relative">
        {/* ❤️ Heart Button */}
        <button
          onClick={toggleFavourite}
          className="absolute top-3 right-3 z-10"
          type="button"
        >
          <Heart
            className={`w-5 h-5 transition-all duration-200 ${
              isFav
                ? "fill-red-500 text-red-500"
                : "text-white/70 hover:text-white hover:scale-110"
            }`}
          />
        </button>

        {/* Song info */}
        <h4 className="font-semibold text-sm truncate pr-8">{title}</h4>
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
    </motion.div>
  );
};

export default SongCard;
