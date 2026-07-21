import './MetricTile.css'

export const MetricTile = ({
    icon: Icon,
    label,
    value,
    unit,
    detail,
    tone = 'primary',
    align = 'start',
    className = '',
}) => {
    const alignClass = align === 'center' ? 'text-center align-items-center' : ''

    return (
        <article className={`metric-tile ${alignClass} ${className}`}>
            {Icon && (
                <span className={`metric-tile-icon metric-tile-icon-${tone}`}>
                    <Icon size={18} />
                </span>
            )}

            <div className="metric-tile-body">
                <p className="metric-tile-label">{label}</p>
                <p className="metric-tile-value">
                    {value}
                    {unit && <span>{unit}</span>}
                </p>
                {detail && <p className="metric-tile-detail">{detail}</p>}
            </div>
        </article>
    )
}
