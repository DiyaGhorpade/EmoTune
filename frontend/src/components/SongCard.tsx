import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Heart, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import SpotifyEmbed from "./SpotifyEmbed";

type SongCardProps = {
  title: string;
  artist: string;
  emotion: string;
  delay?: number;
  link: string;
};

let globalCurrentPlaying: string | null = null;

const SongCard = ({ title, artist, emotion, delay = 0, link}: SongCardProps) => {
  const [isFav, setIsFav] = useState(false);
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [showNewPlaylistInput, setShowNewPlaylistInput] = useState(false);
  const [active, setActive] = useState(false);

  const spotifyEmbedId = link.includes("track/") ? link.split("/track/")[1] : "";

  // Favorites
  const getFavorites = () => {
    try { return JSON.parse(localStorage.getItem("favourites") || "[]"); } 
    catch { return []; }
  };
  const saveFavorites = (favorites: any[]) => localStorage.setItem("favourites", JSON.stringify(favorites));

  // Playlists
  const getPlaylists = () => {
    try { return JSON.parse(localStorage.getItem("playlists") || "[]"); } 
    catch { return []; }
  };
  const savePlaylists = (lists: any[]) => {
    localStorage.setItem("playlists", JSON.stringify(lists));
    window.dispatchEvent(new Event("playlistsUpdated"));
  };

  useEffect(() => {
    setIsFav(getFavorites().some((f: any) => f.link === link));
  }, [link]);

  useEffect(() => {
    if (showPlaylistMenu) setPlaylists(getPlaylists());
  }, [showPlaylistMenu]);

  const toggleFavourite = () => {
    const favorites = getFavorites();
    if (isFav) {
      saveFavorites(favorites.filter((f: any) => f.link !== link));
      setIsFav(false);
    } else {
      favorites.push({ title, artist, emotion, link, addedAt: new Date().toISOString() });
      saveFavorites(favorites);
      setIsFav(true);
    }
    window.dispatchEvent(new Event("favoritesUpdated"));
  };

  const addToPlaylist = (playlistId: string) => {
    const lists = getPlaylists();
    const playlist = lists.find((p: any) => p.id === playlistId);
    if (!playlist) return;
    if (playlist.songs.some((s: any) => s.link === link)) return alert("Already in playlist");
    playlist.songs.push({ title, artist, emotion, link, addedAt: new Date().toISOString() });
    savePlaylists(lists);
    setShowPlaylistMenu(false);
  };

  const createNewPlaylist = () => {
    if (!newPlaylistName.trim()) return alert("Enter name");
    const lists = getPlaylists();
    const newPlaylist = {
      id: Date.now().toString(),
      name: newPlaylistName.trim(),
      createdAt: new Date().toISOString(),
      songs: [{ title, artist, emotion, link, addedAt: new Date().toISOString() }]
    };
    lists.push(newPlaylist);
    savePlaylists(lists);
    setShowPlaylistMenu(false);
    setShowNewPlaylistInput(false);
    setNewPlaylistName("");
  };

  const handlePlay = () => {
    if (globalCurrentPlaying && globalCurrentPlaying !== link) {
      window.dispatchEvent(new CustomEvent("pauseOtherTracks", { detail: globalCurrentPlaying }));
    }
    globalCurrentPlaying = link;
    setActive(true);
  };

  useEffect(() => {
    const pauseHandler = (e: any) => {
      if (e.detail === link) return;
      setActive(false);
    };
    window.addEventListener("pauseOtherTracks", pauseHandler);
    return () => window.removeEventListener("pauseOtherTracks", pauseHandler);
  }, [link]);

  return (
    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: -10 }} transition={{ delay }} className="relative">
      <Card variant="glass" className="p-3 w-100 h-40 relative">
        <button onClick={toggleFavourite} className="absolute top-3 right-10 z-10">
          <Heart className={`w-5 h-5 transition-all duration-200 ${isFav ? "fill-red-500 text-red-500" : "text-white/70 hover:text-white hover:scale-110"}`} />
        </button>
        <button onClick={() => setShowPlaylistMenu(!showPlaylistMenu)} className="absolute top-3 right-3 z-10">
          <Plus className="w-5 h-5 text-white/70 hover:text-white hover:scale-110 transition-all duration-200" />
        </button>

        <h4 className="font-semibold text-sm truncate pr-16">{title}</h4>
        <p className="text-xs text-muted-foreground truncate">{artist}</p>

        <div className="mt-3 rounded-md">
          <SpotifyEmbed spotifyId={spotifyEmbedId} isActive={active} onPlay={handlePlay} />
        </div>
      </Card>

      {showPlaylistMenu && (
        <div className="absolute top-12 right-0 z-50 bg-black/90 backdrop-blur-md border border-white/20 rounded-lg p-3 min-w-[200px] shadow-xl">
          <h5 className="text-sm font-semibold mb-2">Add to Playlist</h5>
          {playlists.length > 0 && (
            <div className="mb-2 max-h-[150px] overflow-y-auto">
              {playlists.map((playlist) => (
                <button key={playlist.id} onClick={() => addToPlaylist(playlist.id)}
                  className="w-full text-left px-2 py-1.5 text-sm hover:bg-white/10 rounded transition">
                  {playlist.name} ({playlist.songs.length})
                </button>
              ))}
            </div>
          )}

          {!showNewPlaylistInput ? (
            <button onClick={() => setShowNewPlaylistInput(true)} className="w-full text-left px-2 py-1.5 text-sm text-primary hover:bg-white/10 rounded transition">
              + Create New Playlist
            </button>
          ) : (
            <div className="space-y-2">
              <input type="text" value={newPlaylistName} onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="Playlist name..." className="w-full px-2 py-1 text-sm bg-white/10 border border-white/20 rounded"
                autoFocus onKeyDown={(e) => { if (e.key === "Enter") createNewPlaylist(); if (e.key === "Escape") setShowNewPlaylistInput(false); }} />
              <div className="flex gap-2">
                <button onClick={createNewPlaylist} className="flex-1 px-2 py-1 text-xs bg-primary text-primary-foreground rounded hover:opacity-90">Create</button>
                <button onClick={() => { setShowNewPlaylistInput(false); setNewPlaylistName(""); }} className="flex-1 px-2 py-1 text-xs bg-white/10 rounded hover:bg-white/20">Cancel</button>
              </div>
            </div>
          )}
          <button onClick={() => setShowPlaylistMenu(false)} className="w-full mt-2 px-2 py-1 text-xs text-muted-foreground hover:text-white">Close</button>
        </div>
      )}
    </motion.div>
  );
};

export default SongCard;
