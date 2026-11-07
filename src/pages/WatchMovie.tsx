import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router";
import VideoPlayer from "../components/VideoPlayer";
import { supabase } from "../components/utils/supabase";
import type {
  IResponseMovie,
  IEpisode,
} from "../components/type/IResponMovies";

export type { IEpisode };

interface ISeriesRecord {
  id: number;
  data: IResponseMovie;
}

interface IMovieRecord {
  id: number | string;
  data: {
    title: string;
    description: string;
  };
  video_url: string | null;
}

export default function WatchMoviePage() {
  const { id } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const mediaTypeParam = searchParams.get("type");
  const episodeParam = searchParams.get("episode");

  const [movie, setMovie] = useState<IMovieRecord | null>(null);
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

      // PEMUTARAN SERIES

      if (mediaTypeParam === "series" || episodeParam !== null) {
        const episodeNumber = episodeParam === null ? 1 : Number(episodeParam);

        if (!Number.isInteger(episodeNumber) || episodeNumber < 1) {
          setErrorMessage("Nomor episode tidak valid.");
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("series")
          .select("id, data")
          .eq("id", id)
          .single();

        if (!isMounted) return;

        if (error) {
          console.error("Gagal mengambil series:", error);

          setErrorMessage("Series tidak ditemukan atau gagal dimuat.");

          setLoading(false);
          return;
        }

        const record = data as ISeriesRecord;
        const seriesData: IResponseMovie = {
          ...record.data,
          id: record.id,
        };

        setSeries(seriesData);

        const episode = seriesData.episodes?.find(
          (item) => item.episode_number === episodeNumber,
        );

        if (!episode) {
          setErrorMessage("Episode tidak ditemukan.");
          setLoading(false);
          return;
        }

        setSelectedEpisode(episode);
        setLoading(false);

        return;
      }

      // PEMUTARAN MOVIE

      const { data, error } = await supabase
        .from("movies")
        .select("id, data, video_url")
        .eq("id", id)
        .single();

      if (!isMounted) return;

      if (error) {
        console.error("Gagal mengambil film:", error);

        setErrorMessage("Film tidak ditemukan atau gagal dimuat.");

        setLoading(false);
        return;
      }

      setMovie(data as IMovieRecord);
      setLoading(false);
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
        title={movie.data.title}
        description={movie.data.description}
      />
    </section>
  );
}
