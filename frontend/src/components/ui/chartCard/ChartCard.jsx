import './ChartCard.css'

export const ChartCard = ({ title, meta, isEmpty = false, emptyText = 'No data yet', children }) => {
    return (
        <section className="chart-card">
            <div className="chart-card-header">
                <h2>{title}</h2>
                {meta && <span>{meta}</span>}
            </div>

            <div className="chart-card-body">
                {isEmpty ? (
                    <div className="chart-empty-state">
                        <p>{emptyText}</p>
                    </div>
                ) : children}
            </div>
        </section>
    )
}
