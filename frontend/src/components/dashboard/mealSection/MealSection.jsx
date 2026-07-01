import './MealSection.css'
import React, { useState } from 'react';
import { ChevronDown, Plus, Trash2 } from 'lucide-react';
import { useAutoAnimate } from '@formkit/auto-animate/react'

const MEAL_META = {
    breakfast: { label: 'Breakfast', emoji: '☕', time: 'Recommended 07:00 - 09:00' },
    lunch: { label: 'Lunch', emoji: '🥗', time: 'Recommended 12:00 - 14:00' },
    dinner: { label: 'Dinner', emoji: '🍝', time: 'Recommended 19:00 - 21:00' },
    snack: { label: 'Snack', emoji: '🍎', time: 'Anytime' }
}

export const MealSection = ({ mealsData, onFoodDeleted }) => {

    const [openMeal, setOpenMeal] = useState('breakfast')
    return (
        <div className='d-flex flex-column gap-3 mt-3'>
            <h2 className='font-heading fs-5 fw-bold mb-2 meals-title'>Meals</h2>
            {Object.keys(MEAL_META).map((mealKey) => {
                const mealRecord = mealsData.find(m => m.mealType === mealKey)
                const mealId = mealRecord?.id
                const items = mealRecord?.items || []
                const totalKcal = mealRecord?.totalMealKcal || 0

                return (
                    <MealCard
                        key={mealKey}
                        mealType={mealKey}
                        meta={MEAL_META[mealKey]}
                        items={items}
                        totalKcal={totalKcal}
                        isOpen={openMeal === mealKey}
                        onToggle={() => setOpenMeal(openMeal === mealKey ? null : mealKey)}
                        mealId={mealId}
                        onFoodDeleted={onFoodDeleted}
                    />
                )

            })}
        </div>
    )
}

const MealCard = ({ mealType, meta, items, totalKcal, isOpen, onToggle, mealId, onFoodDeleted }) => {
    const [parentRef] = useAutoAnimate()
    const [animationParent] = useAutoAnimate()
    return (
        <article ref={parentRef} className="card border-0 radius-3xl shadow-soft-sm  overflow-hidden meal-container">
            <div className="d-flex align-items-center gap-3 p-3 cursor-pointer" onClick={onToggle}>
                <span className="d-flex justify-content-center align-items-center radius-2xl meal-emoji">
                    {meta.emoji}
                </span>

                <div className="flex-grow-1">
                    <span className="d-block font-heading fw-bold meal-label">{meta.label}</span>
                    <span className="d-block small text-muted">
                        {items.length > 0
                            ? `${totalKcal} kcal · ${items.length} item${items.length > 1 ? 's' : ''}`
                            : meta.time}
                    </span>
                </div>

                <ChevronDown
                    className="text-muted transition-transform"
                    style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />

                <button
                    className="btn btn-primary-custom radius-xl p-0 d-flex justify-content-center align-items-center ms-2"
                    style={{ width: '40px', height: '40px' }}
                    onClick={(e) => {
                        e.stopPropagation();
                        console.log(`Oppen modal to add food: ${mealType}`);
                    }}
                >
                    <Plus size={20} />
                </button>
            </div>

            {isOpen && (
                <div className="px-3 pb-3">
                    {items.length === 0 ? (
                        <div className="bg-light radius-2xl p-4 text-center">
                            <p className="small text-muted mb-0">Nothing logged yet. Tap + to add food.</p>
                        </div>
                    ) : (
                        <ul className="list-unstyled d-flex flex-column gap-2 mb-0 mt-2" ref={animationParent}>
                            {items.map((item) => (
                                <FoodRow key={item._id} item={item} mealId={mealId} onFoodDeleted={onFoodDeleted} />
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </article>
    );
};


const FoodRow = ({ item, mealId, onFoodDeleted }) => {
    const food = item.foodId
    console.log(food)
    const foodId = item?.id

    const [startX, setStartX] = useState(null)
    const [dragX, setDragX] = useState(0)

    const isRevealed = dragX <= -60

    const calcMacro = (value_for100g) => {
        const calc = (value_for100g * item.consumedQuantity) / 100
        return Math.round(calc * 100) / 100
    }
    const actualCarbs = calcMacro(food.nutritionalValues.carbs.total);
    const actualProteins = calcMacro(food.nutritionalValues.proteins);
    const actualFats = calcMacro(food.nutritionalValues.fats.total)

    const handleDelete = async () => {
        const token = localStorage.getItem('token')
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/meals/${mealId}/items/${item._id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error('Error during food delete');
            }

            console.log("Food deleted");

            if (onFoodDeleted) {
                onFoodDeleted();
            }

        } catch (e) {
            console.log('Delete error', e)
            setDragX(0)
        }
    }

    const actualKcal = Math.round((food.nutritionalValues.kcal / 100) * item.consumedQuantity);

    const SWIPE_THRESHOLD = -120

    return (
        <li
            className="position-relative overflow-hidden mb-2 radius-3xl"
            style={{
                padding: 0,
                border: 'none',
                backgroundColor: 'transparent',
                transition: 'opacity 0.3s ease-out'
            }}
        >

            <div
                className="position-absolute top-0 bottom-0 end-0 bg-danger d-flex align-items-center justify-content-end px-4 radius-3xl "
                style={{ width: '98%',height: '90%', zIndex: 1, transform: "translate(-1%, 2%)" }}
            >

                <Trash2 size={24} className="text-white" />
            </div>

            <div
                className="d-flex align-items-center gap-3 p-2 bg-light position-relative radius-3xl"
                style={{
                    transition: startX === null ? 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none',
                    transform: `translateX(${dragX}px)`,
                    zIndex: 2
                }}

                onTouchStart={(e) => setStartX(e.touches[0].clientX)}
                onTouchMove={(e) => {
                    if (startX !== null) {
                        const currentX = e.touches[0].clientX
                        const diff = currentX - startX
                        setDragX(Math.min(0, diff))
                    }
                }}
                onTouchEnd={() => {
                    if (dragX <= SWIPE_THRESHOLD) {
                        handleDelete()
                    } else {
                        setDragX(0)
                    }
                    setStartX(null)
                }}
            >
                <span className="d-flex justify-content-center align-items-center bg-white shadow-soft-sm" style={{ width: '40px', height: '40px', borderRadius: '1rem' }}>
                    🍽️
                </span>

                <div className="flex-grow-1">
                    <span className="d-block fw-semibold" style={{ fontSize: '0.9rem' }}>{food.name}</span>
                    <span className="d-block" style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                        {item.consumedQuantity}{food.servingUnit} · {food.brand}
                        <span className='d-none d-sm-inline-block px-1'>
                            · C {actualCarbs}g · P {actualProteins}g · F {actualFats}g
                        </span>
                    </span>
                </div>

                <div className="text-end me-2">
                    <span className="d-block font-heading fw-bold lh-1">{actualKcal}</span>
                    <span className="d-block text-muted" style={{ fontSize: '0.7rem' }}>kcal</span>
                </div>

                <button
                    className="btn btn-sm text-danger p-2 delete-food-btn rounded-circle d-none d-lg-block"
                    onClick={handleDelete}
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </li>
    )
}