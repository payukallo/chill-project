import { useEffect, useState } from "react";
import { useParams } from "react-router";
import VideoPlayer from "../components/VideoPlayer";
import { supabase } from "../components/utils/supabase";

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
  const [movie, setMovie] = useState<IMovieRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchMovie() {
      if (!id) {
        setErrorMessage("ID film tidak ditemukan.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setErrorMessage("");

      const { data, error } = await supabase

        .from("movies")
        .select("id, data, video_url")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Gagal mengambil film:", error);
        setErrorMessage("Film tidak ditemukan atau gagal dimuat.");
        setLoading(false);
        return;
      }
      console.log("Judul:", data.data.title);
      console.log("Video URL:", data.video_url);

      setMovie(data as IMovieRecord);
      setLoading(false);
    }

    fetchMovie();
  }, [id]);

  if (loading) {
    return <p>Memuat film...</p>;
  }

  if (errorMessage) {
    return <p>{errorMessage}</p>;
  }

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
