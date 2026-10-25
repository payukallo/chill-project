export function NewEpisode() {
  return <p className="new-episode body-small-bold">Episode Baru</p>;
}

export function Premium() {
  return <p className="premium body-small-bold">Premium</p>;
}

export function Top10() {
  return <p className="top10 body-small-regular">Top 10</p>;
}

export function BottomText(props) {
  const {title, rating} = props
  return (
    <div className="bottom-text">
      <p className="heading-6">{title}</p>
      <p className="body-small-regular">{rating}</p>
    </div>
  );
}
