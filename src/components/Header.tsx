import { HeadBtn } from "./HeadBtn";
import { HeadText } from "./HeadText";

interface IHeader {
  image: string;
  title: string;
  description: string;
}

export function Header(props: IHeader) {
  const { image, title, description } = props;
  return (
    <header>
      <img src={image} alt="" />
      <div className="header">
        <div className="head-bottom">
          <HeadText title={title} description={description} />
           <HeadBtn />
        </div>
       
      </div>
    </header>
  );
}
