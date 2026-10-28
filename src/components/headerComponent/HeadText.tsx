interface IHeadText {
  title: string;
  description: string;
}

export function HeadText(props: IHeadText) {
  const {title, description} = props
  return (
    <div className="head-text">
      <h1 className="heading-1 head-title">{title}</h1>
      <p className="body-large-medium head-description">
        {description}
      </p>
    </div>
  );
}