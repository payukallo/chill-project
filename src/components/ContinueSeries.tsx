import { AliceInBorderlandContinue, AllOfUsAreDeadContinue, MyPerfectStrangerContinue, TedLassoContinue } from "./MovieList/ContinueList";

export function ContinueSeries() {
  return (
    <div className="continue-movies">
      <h3 className="heading-3">Melanjutkan Tonton Series</h3>
      <div className="movie-top">
        <div className="box-top">
          <AliceInBorderlandContinue />
        </div>
         <div className="box-top">
          <MyPerfectStrangerContinue />
        </div>
         <div className="box-top">
          <AllOfUsAreDeadContinue />
        </div>
         <div className="box-top">
          <TedLassoContinue />
        </div>
      </div>
    </div>
  );
}
