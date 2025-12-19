// src/components/SpotifyEmbed.tsx
const SpotifyEmbed = ({ trackId }: { trackId: string }) => {
  return (
    <iframe
      src={`https://open.spotify.com/embed/track/${trackId}`}
      width="100%"
      height="150"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      style={{ borderRadius: "12px", marginTop: "10px" }}
      loading="lazy"
    />
  );
};

export default SpotifyEmbed;
