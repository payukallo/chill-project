import { AllOfUsAreDeadContinue, AManCalledOttoContinue, BlueLockContinue, DontLookUpContinue } from "./MovieList/ContinueList";

export function ContinueMovies() {
  return (
    <div className="continue-movies">
      <h3 className="heading-3">Melanjutkan Tonton Film</h3>
      <div className="movie-top">
        <div className="box-top">
          <DontLookUpContinue/>
        </div>
        <div className="box-top">
          <AllOfUsAreDeadContinue/>
        </div>
        <div className="box-top">
          <BlueLockContinue/>
        </div>
        <div className="box-top">
          <AManCalledOttoContinue/>
        </div>
         <div className="box-top">
          <DontLookUpContinue/>
        </div>
        <div className="box-top">
          <AllOfUsAreDeadContinue/>
        </div>
        <div className="box-top">
          <BlueLockContinue/>
        </div>
        <div className="box-top">
          <AManCalledOttoContinue/>
        </div>
      </div>
    </div>
  );
}
