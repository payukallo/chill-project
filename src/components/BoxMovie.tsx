interface IBoxMovie {
  movieImg: string;
  isPremium: boolean;
  isTop10: boolean;
  isNewEpisode: boolean;
  title: string;
  rating: string;
}

export function BoxMovie(props: IBoxMovie) {
  const { title, rating, movieImg, isNewEpisode, isPremium, isTop10 } = props;
  return (
    <>
      <img src={movieImg} alt="" />
      <div>
        {isPremium ? <p className="premium body-small-bold">Premium</p>  : <></>}
        {isNewEpisode && !isPremium ? (
          <p className="new-episode body-small-bold">Episode Baru</p>
        ) : (
          <></>
        )}
        {isTop10 ? <p className="top10 body-small-regular">Top 10</p> : <></>}
      </div>
      <div className="bottom-text">
        <p className="heading-6">{title}</p>
        <p className="body-small-regular">{rating}</p>
      </div>
    </>
  );
}
