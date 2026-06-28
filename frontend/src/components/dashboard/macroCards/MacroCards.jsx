
import './MacroCards.css';

export const MacroCards = ({ summary, userGoals }) => {
    const macros = [
        {
            key: 'carbs',
            label: 'Carbs',
            emoji: '🍞',
            value: summary?.carbs?.total || 0,
            target: userGoals?.carbs || 250,
            theme: 'carbs'
        },
        {
            key: 'protein',
            label: 'Protein',
            emoji: '🍗',
            value: summary?.proteins || 0,
            target: userGoals?.proteins || 120,
            theme: 'protein'
        },
        {
            key: 'fat',
            label: 'Fat',
            emoji: '🥑',
            value: summary?.fats?.total || 0,
            target: userGoals?.fats || 65,
            theme: 'fat'
        },
    ]

    return (
        <section className='row g-3 mt-1'>
            {macros.map((m) =>{
                const target = m.target > 0 ? m.target : 1
                const pct = Math.min(100, Math.round((m.value / target) * 100))

                return (
                    <div key={m.key} className='col-4'>
                        <article className='card border-0 shadow-sm radius-3xl h-100 macro-card'>

                            <span className={`macro-icon-box d-flex justify-content-center align-items-center rounded-circle bg-${m.theme}-soft`}>
                                {m.emoji}
                            </span>

                            <p className="mt-3 mb-0 fw-medium">{m.label}</p>

                            <p className="font-heading fs-5 fw-bold lh-sm mb-2">
                                {m.value}
                                <span className="small fw-medium text-muted ms-1">/{m.target}g</span>
                            </p>

                            <div className={`progress macro-progress bg-${m.theme}-soft`}>
                                <div
                                    className={`progress-bar bg-${m.theme}`}
                                    role="progressbar"
                                    style={{ width: `${pct}%` }}
                                    aria-valuenow={pct}
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                ></div>
                            </div>
                        </article>
                    </div>
                )
            })}
        </section>
    )
}
