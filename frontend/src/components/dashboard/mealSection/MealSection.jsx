import './MealSection.css'
import { useState } from 'react'
import { ChevronDown, Plus, Trash2 } from 'lucide-react'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { CATEGORY_EMOJIS } from '../../../lib/costants'
import { deleteFoodFromMeal } from '../../../services/MealService'

const MEAL_META = {
    breakfast: { label: 'Breakfast', emoji: '☕', time: 'Recommended 07:00 - 09:00' },
    lunch: { label: 'Lunch', emoji: '🥗', time: 'Recommended 12:00 - 14:00' },
    dinner: { label: 'Dinner', emoji: '🍝', time: 'Recommended 19:00 - 21:00' },
    snack: { label: 'Snack', emoji: '🍎', time: 'Anytime' }
}

export const MealSection = ({ mealsData, onFoodDeleted, onAddFoodClick }) => {
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
                        onAddFoodClick={onAddFoodClick}
                    />
                )
            })}
        </div>
    )
}

const MealCard = ({ mealType, meta, items, totalKcal, isOpen, onToggle, mealId, onFoodDeleted, onAddFoodClick }) => {
    const [parentRef] = useAutoAnimate()
    const [animationParent] = useAutoAnimate()

    return (
        <article ref={parentRef} className="app-card overflow-hidden meal-container">
            <div className="d-flex align-items-center gap-3 p-3 cursor-pointer" onClick={onToggle}>
                <span className="d-flex justify-content-center align-items-center radius-xl meal-emoji">
                    {meta.emoji}
                </span>

                <div className="flex-grow-1 min-w-0 overflow-hidden">
                    <span className="d-block font-heading fw-bold meal-label text-truncate">{meta.label}</span>
                    <span className="d-block small text-muted-foreground text-truncate">
                        {items.length > 0
                            ? `${totalKcal} kcal · ${items.length} item${items.length > 1 ? 's' : ''}`
                            : meta.time}
                    </span>
                </div>

                <ChevronDown
                    className="text-muted transition-transform flex-shrink-0"
                    style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />

                <button
                    className="btn btn-primary-custom radius-lg p-0 d-flex justify-content-center align-items-center ms-1 flex-shrink-0"
                    style={{ width: '40px', height: '40px' }}
                    aria-label={`Add food to ${meta.label}`}
                    onClick={(e) => {
                        e.stopPropagation()
                        onAddFoodClick?.(mealType)
                    }}
                >
                    <Plus size={20} />
                </button>
            </div>

            {isOpen && (
                <div className="px-3 pb-3">
                    {items.length === 0 ? (
                        <div className="surface-soft radius-xl p-4 text-center">
                            <p className="small text-muted-foreground mb-0">Nothing logged yet. Tap + to add food.</p>
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
    )
}

const FoodRow = ({ item, mealId, onFoodDeleted }) => {
    const food = item.foodId
    const [startX, setStartX] = useState(null)
    const [dragX, setDragX] = useState(0)
    const [isDeleting, setIsDeleting] = useState(false)

    const calcMacro = (valueFor100g = 0) => {
        const calc = (valueFor100g * item.consumedQuantity) / 100
        return Math.round(calc * 100) / 100
    }

    const actualCarbs = calcMacro(food.nutritionalValues.carbs.total)
    const actualProteins = calcMacro(food.nutritionalValues.proteins)
    const actualFats = calcMacro(food.nutritionalValues.fats.total)
    const actualKcal = Math.round((food.nutritionalValues.kcal / 100) * item.consumedQuantity)

    const handleDelete = async (e) => {
        e?.stopPropagation()
        if (isDeleting) return

        setIsDeleting(true)
        setDragX(-90)

        try {
            await deleteFoodFromMeal(mealId, item._id)
            onFoodDeleted?.()
        } catch (e) {
            console.log('Delete error', e)
            setIsDeleting(false)
            setDragX(0)
        }
    }

    const SWIPE_THRESHOLD = -120

    return (
        <li className={`food-row position-relative overflow-hidden radius-xl ${isDeleting ? 'food-row-deleting' : ''}`}>
            <div className="food-delete-bg position-absolute top-0 bottom-0 end-0 bg-danger d-flex align-items-center justify-content-end px-4 radius-xl">
                <Trash2 size={22} className="text-white" />
            </div>

            <div
                className="food-row-content d-flex align-items-center gap-3 p-2 surface-soft position-relative radius-xl"
                style={{
                    transition: startX === null ? 'transform 0.25s ease, opacity 0.2s ease' : 'none',
                    transform: `translateX(${dragX}px)`,
                    zIndex: 2
                }}
                onTouchStart={(e) => {
                    if (!isDeleting) setStartX(e.touches[0].clientX)
                }}
                onTouchMove={(e) => {
                    if (startX !== null && !isDeleting) {
                        const currentX = e.touches[0].clientX
                        const diff = currentX - startX
                        setDragX(Math.max(-140, Math.min(0, diff)))
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
                <span className="food-icon d-flex justify-content-center align-items-center bg-white shadow-soft-sm radius-lg flex-shrink-0">
                    {CATEGORY_EMOJIS[food.category] || CATEGORY_EMOJIS.other}
                </span>

                <div className="flex-grow-1 overflow-hidden">
                    <span className="d-block fw-semibold text-truncate food-name">{food.name}</span>
                    <span className="d-block text-muted-foreground food-meta text-truncate">
                        {item.consumedQuantity}{food.servingUnit} · {food.brand}
                        <span className='d-none d-sm-inline-block px-1'>
                            · C {actualCarbs}g · P {actualProteins}g · F {actualFats}g
                        </span>
                    </span>
                </div>

                <div className="text-end me-1 flex-shrink-0">
                    <span className="d-block font-heading fw-bold lh-1">{actualKcal}</span>
                    <span className="d-block text-muted-foreground food-kcal-label">kcal</span>
                </div>

                <button
                    className="btn btn-sm text-danger p-2 delete-food-btn rounded-circle d-none d-lg-flex align-items-center justify-content-center flex-shrink-0"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    aria-label={`Delete ${food.name}`}
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </li>
    )
}
