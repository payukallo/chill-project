import { FootNormalGenre, FootNormalHelp } from "./FootNormalScreen ";
import { FootSmallGenre, FootSmallHelp } from "./FootSmallScreen";

export function RightFoot() {
  return (
    <div className="right-foot">
      <FootNormalGenre/>
      <FootSmallGenre/>
      <FootNormalHelp/>
      <FootSmallHelp/>
    </div>
  );
}
