import { playlistSongs } from "@/data/musicData";
import { Card } from "@/components/ui/card";

export default function Playlist() {
  return (
    <section className="min-h-screen px-6 py-20">
      <h1 className="text-4xl font-bold mb-2">Your Playlist</h1>
      <p className="text-muted-foreground mb-10">
        Songs curated based on your emotions
      </p>

      <div className="grid gap-4 max-w-3xl">
        {playlistSongs.map(song => (
          <Card key={song.id} variant="glass" className="p-4 flex justify-between">
            <div>
              <h3 className="font-semibold">{song.title}</h3>
              <p className="text-sm text-muted-foreground">
                {song.artist} • {song.mood}
              </p>
            </div>
            <span className="text-sm text-muted-foreground">
              {song.duration}
            </span>
          </Card>
        ))}
      </div>
    </section>
  );
}
