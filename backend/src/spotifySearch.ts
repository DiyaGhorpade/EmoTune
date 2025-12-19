import fetch from "node-fetch";

export async function searchSpotifyTrack(
  track: string,
  artist: string,
  token: string
) {
  const q = encodeURIComponent(`track:${track} artist:${artist}`);

  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${q}&type=track&limit=1`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) return null;

 const data = (await res.json()) as {
  tracks: {
    items: { id: string }[];
  };
};

return data.tracks.items[0]?.id ?? null;

}
