import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Music, Trash2 } from "lucide-react";
import SongCard from "@/components/SongCard";

export default function Playlists() {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<any>(null);

  const loadPlaylists = () => {
    try {
      const lists = localStorage.getItem("playlists");
      const parsed = lists ? JSON.parse(lists) : [];
      setPlaylists(parsed);
      console.log("Loaded playlists:", parsed.length);
    } catch (error) {
      console.error("Error loading playlists:", error);
      setPlaylists([]);
    }
  };

  const deletePlaylist = (playlistId: string) => {
    if (!confirm("Are you sure you want to delete this playlist?")) return;

    const updated = playlists.filter((p) => p.id !== playlistId);
    localStorage.setItem("playlists", JSON.stringify(updated));
    setPlaylists(updated);
    if (selectedPlaylist?.id === playlistId) {
      setSelectedPlaylist(null);
    }
  };

  const removeSongFromPlaylist = (playlistId: string, songLink: string) => {
    const lists = [...playlists];
    const playlist = lists.find((p) => p.id === playlistId);

    if (playlist) {
      playlist.songs = playlist.songs.filter((s: any) => s.link !== songLink);
      localStorage.setItem("playlists", JSON.stringify(lists));
      setPlaylists(lists);

      if (selectedPlaylist?.id === playlistId) {
        setSelectedPlaylist(playlist);
      }
    }
  };

  useEffect(() => {
    loadPlaylists();

    const handleUpdate = () => loadPlaylists();
    window.addEventListener("playlistsUpdated", handleUpdate);

    return () => {
      window.removeEventListener("playlistsUpdated", handleUpdate);
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {!selectedPlaylist ? (
        <>
          <h2 className="text-2xl font-bold mb-6">🎵 Your Playlists</h2>

          {playlists.length === 0 ? (
            <p className="text-muted-foreground">
              No playlists yet. Click the + icon on any song to create your first playlist!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {playlists.map((playlist) => (
                <Card
                  key={playlist.id}
                  variant="glass"
                  className="p-4 cursor-pointer hover:scale-105 transition-transform relative"
                  onClick={() => setSelectedPlaylist(playlist)}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePlaylist(playlist.id);
                    }}
                    className="absolute top-3 right-3 text-red-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-3 mb-2">
                    <Music className="w-8 h-8 text-primary" />
                    <div>
                      <h3 className="font-semibold text-lg">{playlist.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {playlist.songs.length} song{playlist.songs.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Created {new Date(playlist.createdAt).toLocaleDateString()}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <button
            onClick={() => setSelectedPlaylist(null)}
            className="mb-4 text-primary hover:underline"
          >
            ← Back to Playlists
          </button>

          <h2 className="text-2xl font-bold mb-6">🎵 {selectedPlaylist.name}</h2>

          {selectedPlaylist.songs.length === 0 ? (
            <p className="text-muted-foreground">No songs in this playlist yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {selectedPlaylist.songs.map((song: any, i: number) => (
                <div key={song.link} className="relative">
                  <SongCard
                    title={song.title}
                    artist={song.artist}
                    emotion={song.emotion}
                    link={song.link}
                    delay={i * 0.05}
                  />
                  <button
                    onClick={() => removeSongFromPlaylist(selectedPlaylist.id, song.link)}
                    className="absolute top-1 left-1 z-20 bg-black/80 rounded-full p-1.5 text-red-400 hover:text-red-500"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}