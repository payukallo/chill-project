import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router";
import VideoPlayer from "../components/VideoPlayer";
import { getMovies, getSeries } from "../components/type/MovieApi";
import type {
  IResponseMovie,
  IEpisode,
} from "../components/type/IResponMovies";

export type { IEpisode };

export default function WatchMoviePage() {
  const { id } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const mediaTypeParam = searchParams.get("type");
  const episodeParam = searchParams.get("episode");

  const [movie, setMovie] = useState<IResponseMovie | null>(null);
  const [series, setSeries] = useState<IResponseMovie | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<IEpisode | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchWatchData() {
      if (!id) {
        setErrorMessage("ID tidak ditemukan.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setErrorMessage("");
      setMovie(null);
      setSeries(null);
      setSelectedEpisode(null);

      try {
        const mediaId = Number(id);

        if (!Number.isSafeInteger(mediaId) || mediaId <= 0) {
          throw new Error("ID tidak valid.");
        }

        const isSeries = mediaTypeParam === "series" || episodeParam !== null;

        if (isSeries) {
          const episodeNumber =
            episodeParam === null ? 1 : Number(episodeParam);

          if (!Number.isInteger(episodeNumber) || episodeNumber < 1) {
            setErrorMessage("Nomor episode tidak valid.");
            return;
          }

          const seriesData = await getSeries();

          if (!isMounted) return;

          const selectedSeries = seriesData.find((item) => item.id === mediaId);

          if (!selectedSeries) {
            setErrorMessage("Series tidak ditemukan.");
            return;
          }

          const episode = selectedSeries.episodes?.find(
            (item) => item.episode_number === episodeNumber,
          );

          if (!episode) {
            setErrorMessage("Episode tidak ditemukan.");
            return;
          }

          setSeries(selectedSeries);
          setSelectedEpisode(episode);
        } else {
          const movieData = await getMovies();

          if (!isMounted) return;

          const selectedMovie = movieData.find((item) => item.id === mediaId);

          if (!selectedMovie) {
            setErrorMessage("Film tidak ditemukan.");
            return;
          }

          setMovie(selectedMovie);
        }
      } catch (error) {
        console.error("Gagal mengambil data pemutar:", error);

        if (isMounted) {
          setErrorMessage("Konten tidak ditemukan atau gagal dimuat.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchWatchData();

    return () => {
      isMounted = false;
    };
  }, [id, episodeParam, mediaTypeParam]);

  if (loading) {
    return <p>Memuat video...</p>;
  }

  if (errorMessage) {
    return <p>{errorMessage}</p>;
  }

  // SERIES PLAYER

  if (mediaTypeParam === "series" || episodeParam !== null) {
    if (!series || !selectedEpisode) {
      return <p>Episode tidak ditemukan.</p>;
    }

    if (!selectedEpisode.video_url) {
      return <p>Video episode ini belum tersedia.</p>;
    }

    return (
      <section className="watch-movie">
        <VideoPlayer
          src={selectedEpisode.video_url}
          title={selectedEpisode.title}
          description={selectedEpisode.description}
          mediaId={series.id}
          episodeId={selectedEpisode.episode_id}
          episodes={series.episodes ?? []}
          activeEpisode={selectedEpisode.episode_number}
          onEpisodeSelect={(episode) => {
            setSelectedEpisode(episode);

            const newUrl = `${location.pathname}?type=series&episode=${episode.episode_number}`;

            window.history.replaceState(null, "", newUrl);
          }}
        />
      </section>
    );
  }

  // MOVIE PLAYER

  if (!movie) {
    return <p>Data film tidak tersedia.</p>;
  }

  if (!movie.video_url) {
    return <p>Video untuk film ini belum tersedia.</p>;
  }

  return (
    <section className="watch-movie">
      <VideoPlayer
        src={movie.video_url}
        title={movie.title ?? ""}
        description={movie.description ?? ""}
        mediaId={movie.id}
        episodeId={null}
      />
    </section>
  );
}
