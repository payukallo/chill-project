import type { IAdminSeries } from "../type/IAdminSeries";

interface SeriesListProps {
  series: IAdminSeries[];
  onEdit: (series: IAdminSeries) => void | Promise<void>;
  onDelete: (id: number) => void | Promise<void>;
}

export function SeriesList({ series, onEdit, onDelete }: SeriesListProps) {
  return (
    <div className="admin-list">
      {series.length === 0 ? (
        <p>Belum ada Series yang tersedia.</p>
      ) : (
        series.map((item) => (
          <div key={item.id} className="series-admin-item">
            <div className="box-series">
              <img src={item.banner_url} alt={item.title} />
              <div>
                {item.is_premium ? (
                  <p className="premium body-small-bold">Premium</p>
                ) : null}
                {item.is_top_10 ? (
                  <p className="top10 body-small-regular">Top 10</p>
                ) : null}
              </div>
              <div className="bottom-text">
                <div className="bottom-text-box">
                  <p className="heading-6">{item.title}</p>
                  <p className="body-small-regular">
                    ★&nbsp;&nbsp;{item.rating}
                  </p>
                </div>
                <div className="admin-button">
                  <button type="button" onClick={() => void onEdit(item)}>
                    Edit
                  </button>
                  <button type="button" onClick={() => void onDelete(item.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
