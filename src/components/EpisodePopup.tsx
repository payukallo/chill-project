
import type { IEpisode } from "./type/IResponMovies";

interface IEpisodePopupProps {
  episodes: IEpisode[];
  activeEpisode: number;
  onEpisodeSelect: (episode: IEpisode) => void;
  onClose: () => void;
}

export function EpisodePopup({
  episodes,
  activeEpisode,
  onEpisodeSelect,
  onClose,
}: IEpisodePopupProps) {
  return (
    <div className="episode-popup">
      <div className="episode-popup-header">
        <h3>← Episode Selanjutnya</h3>

        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup episode"
        >
          ×
        </button>
      </div>

      <div className="episode-popup-list">
        {episodes.map((episode) => {
          const isActive =
            episode.episode_number === activeEpisode;

          return (
            <button
              type="button"
              key={episode.episode_number}
              className={`episode-item-pop-up ${
                isActive ? "active" : ""
              }`}
              onClick={() => onEpisodeSelect(episode)}
            >
              {isActive ? (
                <div className="episode-active-pop-up">
                  <span className="body-medium-semiBold">
                    Episode {episode.episode_number}
                  </span>

                  <div className="episode-active-box">
                    <img
                      src={episode.thumbnail}
                      alt={episode.title}
                      className="episode-thumbnail"
                    />

                    <div className="episode-info-pop-up">
                      <span className="body-small-bold">
                        {episode.title}
                      </span>

                      <p className="body-small-regular">
                        {episode.description}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <span className="episode-inactive-title">
                  Episode {episode.episode_number}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
