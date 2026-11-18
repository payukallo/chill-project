import type { IResponseMovie, IEpisode } from "./type/IResponMovies";

import { SeriesPopupContent } from "./SeriesPopupContent";

interface IPopUpMovie {
  movie: IResponseMovie;
  onClose: () => void;
  onPlayEpisode: (episode: IEpisode) => void;
  fromContinueWatching?: boolean;
}

export function PopUpSeriesBottom({
  movie,
  onClose,
  onPlayEpisode,
  fromContinueWatching = false,
}: IPopUpMovie) {
  return (
    <SeriesPopupContent
      movie={movie}
      onClose={onClose}
      onPlayEpisode={onPlayEpisode}
      fromContinueWatching={fromContinueWatching}
      variant="bottom"
    />
  );
}
