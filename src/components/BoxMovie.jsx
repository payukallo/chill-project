export function BoxMovie(props) {
  const { movieImg, newEpisode, premium, top10 } = props;
  return (
    <>
      <img src={movieImg} alt="" />
      <div>
        {newEpisode}
        {premium}
        {top10}
      </div>
    </>
  );
}
