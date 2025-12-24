import { useEffect, useState } from "react";
import SongCard from "@/components/SongCard";

export default function Favourites() {
  const [songs, setSongs] = useState<any[]>([]);

  const loadFavorites = () => {
    try {
      const favs = localStorage.getItem("favourites");
      const parsed = favs ? JSON.parse(favs) : [];
      setSongs(parsed);
      console.log("Loaded favorites:", parsed.length);
    } catch (error) {
      console.error("Error loading favorites:", error);
      setSongs([]);
    }
  };

  useEffect(() => {
    // Load favorites on mount
    loadFavorites();

    // Listen for updates from other components
    const handleUpdate = () => loadFavorites();
    window.addEventListener("favoritesUpdated", handleUpdate);

    return () => {
      window.removeEventListener("favoritesUpdated", handleUpdate);
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6">❤️ Your Favourites</h2>

      {songs.length === 0 ? (
        <p className="text-muted-foreground">
          No favourites yet. Click the heart icon on any song to add it here!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {songs.map((song, i) => (
            <SongCard
              key={song.link}
              title={song.title}
              artist={song.artist}
              emotion={song.emotion}
              link={song.link}
              delay={i * 0.05}
            />
          ))}
        </div>
      )}
    </div>
  );
}