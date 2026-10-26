interface ITitle {
  title: string;
  subTitle: string;
}

export function Title(props: ITitle) {
  const { title, subTitle } = props;
  return (
    <div className="title">
      <h3 className="heading-3">{title}</h3>
      <p className="body-medium-regular">{subTitle}</p>
    </div>
  );
}
