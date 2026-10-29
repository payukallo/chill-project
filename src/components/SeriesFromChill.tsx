
import { useEffect, useState } from "react";
import { IResponseMovie } from "./type/IResponMovies";
import { PopUpSeries } from "./PopUpSeries";

interface ISeriesFromChill {
  id: number;
  movie_id: number;
}

export function SeriesFromChill() {
  const [seriesList, setSeriesList] = useState<IResponseMovie[]>([]);
  const [selectedSeriesId, setSelectedSeriesId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    async function fetchSeriesFromChill() {
      try {
        const [seriesResponse, chillResponse] = await Promise.all([
          fetch("http://localhost:3000/series"),
          fetch("http://localhost:3000/series_from_chill"),
        ]);

        if (!seriesResponse.ok || !chillResponse.ok) {
          throw new Error("Gagal mengambil data series");
        }

        const seriesData: IResponseMovie[] = await seriesResponse.json();
        const chillData: ISeriesFromChill[] = await chillResponse.json();

        const selectedSeries = chillData
          .map((item) =>
            seriesData.find(
              (series) => String(series.id) === String(item.movie_id),
            ),
          )
          .filter(
            (series): series is IResponseMovie =>
              series !== undefined,
          );

        setSeriesList(selectedSeries);
      } catch (error) {
        console.error("Fetch series from Chill error:", error);
      }
    }

    fetchSeriesFromChill();
  }, []);

  return (
    <div className="movies">
      <h3 className="heading-3">Series Persembahan Chill</h3>

      <div className="movie-list">
        {seriesList.map((series) => (
          <div key={series.id} className="box">
            <img
              src={series.cover_url}
              alt={series.title}
              onClick={() => {if (series.id !== undefined) { setSelectedSeriesId(series.id)}}}
            />
            <div>
              {series.is_premium && (
                <p className="premium body-small-bold">Premium</p>
              )}

              {series.is_new_episode && !series.is_premium && (
                <p className="new-episode body-small-bold">
                  Episode Baru
                </p>
              )}

              {series.is_top_10 && (
                <p className="top10 body-small-regular">Top 10</p>
              )}
            </div>

            <div className="bottom-text">
              <p className="heading-6">{series.title}</p>
              <p className="body-small-regular">{series.rating}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedSeriesId !== null && (
        <>
          <div
            className="page-overlay"
            onClick={() => setSelectedSeriesId(null)}
          />

          <PopUpSeries
            movieId={selectedSeriesId}
            onClose={() => setSelectedSeriesId(null)}
          />
        </>
      )}
    </div>
  );
}
