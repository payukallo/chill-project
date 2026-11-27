import VideoPlayer from "../components/VideoPlayer";
import PremiumVideoPlayer from "../components/PremiumVideoPlayer";
import { useWatchPlayback } from "../components/hooks/UseWatchPlayback";

export type { IEpisode } from "../components/type/IResponMovies";

export default function WatchMoviePage() {
  const {
    media,
    isSeries,
    selectedEpisode,
    videoUrl,
    isPremiumLocked,
    loading,
    switchingEpisode,
    errorMessage,
    handleEpisodeSelect,
  } = useWatchPlayback();

  // LOADING

  if (loading) {
    return <p>Memuat video...</p>;
  }

  // ERROR

  if (errorMessage) {
    return <p>{errorMessage}</p>;
  }

  // MEDIA VALIDATION

  if (!media) {
    return <p>Konten tidak ditemukan.</p>;
  }

  if (isSeries && !selectedEpisode) {
    return <p>Episode tidak ditemukan.</p>;
  }

  // PREMIUM LOCKED

  if (isPremiumLocked) {
    return (
      <section className="watch-movie">
        <PremiumVideoPlayer
          bannerUrl={media.banner_url || media.cover_url || ""}
          title={
            selectedEpisode
              ? `${media.title} - Episode ${selectedEpisode.episode_number}: ${selectedEpisode.title}`
              : (media.title ?? "")
          }
          isSeries={isSeries}
        />
      </section>
    );
  }

  // VIDEO VALIDATION

  if (!videoUrl) {
    return <p>Video belum tersedia.</p>;
  }

  // VIDEO PLAYER

  return (
    <>
      {switchingEpisode && <p>Memuat episode...</p>}

      <section
        className="watch-movie"
        style={{
          display: switchingEpisode ? "none" : undefined,
        }}
      >
        <VideoPlayer
          src={videoUrl}
          title={selectedEpisode?.title ?? media.title ?? ""}
          description={selectedEpisode?.description ?? media.description ?? ""}
          mediaId={media.id}
          episodeId={selectedEpisode?.episode_id ?? null}
          episodes={isSeries ? (media.episodes ?? []) : []}
          activeEpisode={selectedEpisode?.episode_number ?? 1}
          onEpisodeSelect={
            isSeries
              ? (episode) => void handleEpisodeSelect(episode)
              : undefined
          }
        />
      </section>
    </>
  );
}
