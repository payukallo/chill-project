import { NewRelease } from "./NewRelease";
import { ContinueSeries } from "./ContinueSeries";
import { SeriesFromChill } from "./SeriesFromChill";
import { TopRatingSeries } from "./TopRatingSeries";
import { TrendingSeries } from "./TrendingSeries";

export function SeriesContent() {
  return (
    <div className="content">
      <ContinueSeries />
      <SeriesFromChill/>
      <TopRatingSeries />
      <TrendingSeries />
      <NewRelease />
    </div>
  );
}
