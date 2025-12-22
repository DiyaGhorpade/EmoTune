import { favouriteSongs } from "@/data/musicData";
import { Card } from "@/components/ui/card";

export default function Favourites() {
  return (
    <section className="min-h-screen px-6 py-20">
      <h1 className="text-4xl font-bold mb-2">Favourite Songs</h1>
      <p className="text-muted-foreground mb-10">
        Your most loved tracks
      </p>

      <div className="grid gap-4 max-w-3xl">
        {favouriteSongs.map(song => (
          <Card key={song.id} variant="glass" className="p-4 flex justify-between">
            <div>
              <h3 className="font-semibold">{song.title}</h3>
              <p className="text-sm text-muted-foreground">
                {song.artist}
              </p>
            </div>
            <span className="text-sm text-muted-foreground">
              Plays: {song.plays}
            </span>
          </Card>
        ))}
      </div>
    </section>
  );
}
