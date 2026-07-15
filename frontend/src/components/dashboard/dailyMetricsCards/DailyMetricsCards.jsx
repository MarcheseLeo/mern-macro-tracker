import React, { useState } from 'react'
import { Droplets, Minus, Plus, Scale, CalendarX } from 'lucide-react'
import { InfoModal } from '../../infoModal/Infomodal'
import './DailyMetricsCards.css'

export const DailyMetricsCards = ({
    summary,
    user,
    selectedDate,
    onUpdateWater,
    onUpdateWeight
}) => {
    const [showFutureModal, setShowFutureModal] = useState(false)
    const d = new Date();
    const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    
    const GLASS_SIZE = 0.25
    const GOAL_GLASSES = 8
    const currentWaterLiters = summary?.water || 0
    const glassesDrunk = Math.floor(currentWaterLiters / GLASS_SIZE)

    const handleWaterChange = (amount) => {
        if (selectedDate > today) {
            setShowFutureModal(true)
            return
        }
        if (amount < 0 && currentWaterLiters <= 0) return
        onUpdateWater(amount)
    }

    let currentWeight = summary?.weight || 0
    const goalWeight = user?.goalWeight || 0


    const handleWeightChange = (amount) => {
        if (selectedDate > today) {
            setShowFutureModal(true)
            return
        }
        const newWeight = Number((currentWeight + amount).toFixed(1))
        if (newWeight > 0) {
            onUpdateWeight(newWeight)
        }
    }

    const handleGlassClick = (index) => {
        if (selectedDate > today) {
            setShowFutureModal(true)
            return
        }
        let targetGlasses

        if (index >= glassesDrunk) {
            targetGlasses = index + 1
        } else {
            targetGlasses = index
        }

        const targetLiters = targetGlasses * GLASS_SIZE
        const amountToChange = targetLiters - currentWaterLiters

        if (amountToChange != 0) {
            onUpdateWater(amountToChange)
        }
    }

    return (
        <div className="row g-3 mt-1">

            {/* WATER CARD */}
            <div className="col-12 col-md-7">
                <article className="app-card p-3 p-md-4 h-100">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                        <div className="d-flex align-items-center gap-2">
                            <div className="metrics-icon-box metrics-water-icon-box  bg-water-soft text-water-foreground">
                                <Droplets size={20} color='var(--water-foreground)' />
                            </div>
                            <div>
                                <p className="font-heading fs-6 fw-bold mb-0 lh-1 text-dark">Water</p>
                                <p className="text-muted small mb-0 mt-1">
                                    {glassesDrunk} of {GOAL_GLASSES} glasses
                                </p>
                            </div>
                        </div>

                        <div className="d-flex align-items-center gap-2">
                            <button
                                onClick={() => handleWaterChange(-GLASS_SIZE)}
                                className="metrics-btn btn-water-minus cursor-pointer"
                                disabled={glassesDrunk === 0}
                            >
                                <Minus size={16} />
                            </button>
                            <button
                                onClick={() => handleWaterChange(GLASS_SIZE)}
                                className="metrics-btn btn-water-plus"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>

                    {/* GLASSES */}
                    <div className="d-flex gap-2 mt-4">
                        {[...Array(GOAL_GLASSES)].map((_, i) => (
                            <div
                                key={i}
                                onClick={() => handleGlassClick(i)}
                                className={`water-glass-container cursor-pointer ${i < glassesDrunk ? 'filled' : ''}`}
                            >
                                <div className={`water-glass-fill ${i < glassesDrunk ? 'filled' : ''}`}></div>
                            </div>
                        ))}
                    </div>
                </article>
            </div>

            {/* WEIGHT CARD */}
            <div className="col-12 col-md-5">
                <article className="app-card p-3 p-md-4 h-100 d-flex flex-column justify-content-between">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                        <div className="d-flex align-items-center gap-2">
                            <div className="metrics-icon-box metrics-weight-icon-box bg-accent text-accent-foreground">
                                <Scale size={20} color='var(--accent-foreground)' />
                            </div>
                            <div>
                                <p className="font-heading fs-6 fw-bold mb-0 lh-1 text-dark">Weight</p>
                                <p className="text-muted small mb-0 mt-1">
                                    Goal: {goalWeight} kg
                                </p>
                            </div>
                        </div>

                        <div className="d-flex align-items-center gap-2">
                            <button
                                onClick={() => handleWeightChange(-0.1)}
                                className="metrics-btn btn-water-minus"
                            >
                                <Minus size={16} />
                            </button>
                            <button
                                onClick={() => handleWeightChange(0.1)}
                                className="metrics-btn btn-weight-plus bg-accent text-accent-foreground"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="mt-3">
                        <p className="font-heading fw-bold m-0 text-dark" style={{ fontSize: '2rem' }}>
                            {currentWeight} <span className="fs-6 fw-medium text-muted">kg</span>
                        </p>
                    </div>
                </article>
            </div>

            <InfoModal
                show={showFutureModal}
                onHide={() => setShowFutureModal(false)}
                title="Future Date"
                description="You cannot track water or weight for a future date. Please select today date."
                icon={CalendarX}
            />
        </div>
    )
}
