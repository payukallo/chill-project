import type { IResponseMovie, IEpisode } from "./type/IResponMovies";
import { SeriesPopupContent } from "./SeriesPopupContent";

interface IPopUpMovie {
  movie: IResponseMovie;
  onClose: () => void;
  onPlayEpisode: (episode: IEpisode) => void;
  fromContinueWatching?: boolean;
  variant: "top" | "bottom" | "my-list" | "my-list-profile";
}

export function PopUpSeries({
  movie,
  onClose,
  onPlayEpisode,
  fromContinueWatching = false,
  variant,
}: IPopUpMovie) {
  return (
    <SeriesPopupContent
      movie={movie}
      onClose={onClose}
      onPlayEpisode={onPlayEpisode}
      fromContinueWatching={fromContinueWatching}
      variant={variant}
    />
  );
}
