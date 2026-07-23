import React, { useState, useEffect, useContext } from 'react';
import { Search, PlusCircle, ScanLine, X, ArrowLeft, CalendarX } from 'lucide-react'
import { SearchFoodView } from '../foodView/SearchFoodView';
import { FoodDetailsView } from '../foodView/FoodDetailsView';
import { CustomFoodView } from '../foodView/CustomFoodView';
import { InfoModal } from '../../infoModal/Infomodal'
import { addFoodToMeal, editFoodInMeal } from '../../../services/MealService';
import './AddFoodSheet.css'
import { BarcodeScanner } from '../foodView/BarcodeScanner';
import { getFoodByBarcode, getFoods } from '../../../services/FoodService';
import { DashboardContext } from '../../../context/DashboardContext';

const MEAL_META = {
    breakfast: { label: 'Breakfast', emoji: '☕' },
    lunch: { label: 'Lunch', emoji: '🥗' },
    dinner: { label: 'Dinner', emoji: '🍝' },
    snack: { label: 'Snack', emoji: '🍎' }
}

export const AddFoodSheet = ({ open, onClose, selectedDate, defaultMeal = "breakfast", onFoodAdded }) => {

    const [showFutureModal, setShowFutureModal] = useState(false)
    const [mode, setMode] = useState('choices')
    const [meal, setMeal] = useState(defaultMeal)
    const [selectedFood, setSelectedFood] = useState(null)

    const { editingItem, setEditingItem } = useContext(DashboardContext)

    const saveFoodToMeal = async (foodId, quantity, shouldClose = true) => {
        try {
            if (editingItem) {
                await editFoodInMeal(editingItem.mealId, editingItem._id, quantity)
            } else {
                await addFoodToMeal(meal, selectedDate, foodId, quantity)
            }

            if (shouldClose) handleClose()
            if (onFoodAdded) onFoodAdded()
        } catch (e) {
            console.error(e)
        }
    }

    const onScanSuccess = async (barcode) => {
        try {
            const food = await getFoodByBarcode(barcode)
            if (food) {
                setSelectedFood(food)
                setMode('details')
            } else {
                setSelectedFood({
                    barcode: barcode,
                    source: 'user'
                })
                setMode('custom')
            }
        } catch (e) {
            console.log(e)
            setSelectedFood({
                barcode: barcode,
                source: 'user'
            })
            setMode('custom')
        }
    }

    const handleClose = () => {
        setEditingItem(null)
        onClose()
    }

    useEffect(() => {
        if (editingItem) {
            setMode('details')
            setSelectedFood(editingItem.foodId)
        } else {
            setMode('choices')
            setMeal(defaultMeal)
            setSelectedFood(null)
        }
    }, [open, defaultMeal, editingItem])

    if (!open) return null

    const choices = [
        { mode: 'search', icon: Search, label: 'Search food', desc: 'Find from our database', color: 'primary' },
        { mode: 'custom', icon: PlusCircle, label: 'Create custom food', desc: 'Add your own recipe', color: 'warning' },
        { mode: 'scan', icon: ScanLine, label: 'Scan barcode', desc: 'Find products by using barcode scan', color: 'success' },
    ]

    return (
        <div
            className="position-fixed top-0 bottom-0 start-0 end-0 bg-dark bg-opacity-50 d-flex flex-column justify-content-end justify-content-md-center  food-sheet-bg"
        >
            <div
                className="bg-white radius-3xl w-100 p-4 shadow-lg d-flex flex-column mx-auto food-sheet-container"
            >
                {/* HEADER */}
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center gap-2">
                        {mode !== 'choices' && (
                            <button
                                onClick={() => {
                                    setSelectedFood(null)
                                    setMode(mode === 'details' ? 'search' : 'choices')
                                }
                                }
                                className="btn btn-light rounded-circle p-2 d-flex justify-content-center align-items-center"
                            >
                                <ArrowLeft size={20} />
                            </button>
                        )}
                        <h2 className="h5 font-heading fw-bold mb-0 text-dark">
                            {mode === 'choices' && 'Add to your day'}
                            {mode === 'search' && 'Search food'}
                            {mode === 'details' && 'Food Details'}
                            {mode === 'custom' && 'Custom food'}
                        </h2>
                    </div>

                    <button onClick={handleClose} className="btn btn-light rounded-circle p-2 d-flex justify-content-center align-items-center">
                        <X size={20} />
                    </button>
                </div>

                {/* NAV PILLS */}
                {!editingItem && (
                    <div className="d-flex gap-2 overflow-x-auto pt-1 pb-2 mb-2 no-scrollbar" style={{ minHeight: '50px' }}>
                        {Object.keys(MEAL_META).map((m) => (
                            <button
                                key={m}
                                onClick={() => setMeal(m)}
                                className={`btn rounded-pill px-3 py-2 d-flex align-items-center gap-2 text-nowrap ${meal === m ? 'btn-primary-custom text-white fw-bold' : 'btn-light '} meal-pill`}
                            >
                                <span>{MEAL_META[m].emoji}</span>
                                {MEAL_META[m].label}
                            </button>
                        ))}
                    </div>
                )}


                {/* VIEW SELECTOR */}
                <div className="flex-grow-1 d-flex flex-column  overflow-y-scroll no-scrollbar">

                    {mode === 'choices' && (
                        <div className="d-flex flex-column gap-3">
                            {choices.map((c) => (
                                <button
                                    key={c.mode}
                                    disabled={c.disabled}
                                    onClick={() => setMode(c.mode)}
                                    className={`btn btn-outline-light text-start p-3 rounded-4 d-flex align-items-center gap-3 border ${c.disabled ? 'opacity-50' : ''} view-btn`}
                                >
                                    <div className={`bg-${c.color} bg-opacity-10 text-${c.color} rounded-3 p-3 d-flex justify-content-center align-items-center`}>
                                        <c.icon size={24} />
                                    </div>
                                    <div>
                                        <span className="d-block fw-bold text-dark">{c.label}</span>
                                        <span className="small text-muted">{c.desc}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* SEARCH VIEW */}
                    {mode === 'search' && (
                        <SearchFoodView
                            onFoodSelect={(food) => {
                                setSelectedFood(food);
                                setMode('details');
                            }}
                            onQuickAdd={(food) => {
                                saveFoodToMeal(food._id, food.servingSize, false)
                            }}
                        />
                    )}

                    {/* DETAILS VIEW */}
                    {mode === 'details' && selectedFood && (
                        <FoodDetailsView
                            food={selectedFood}
                            initialQuantity={editingItem ? editingItem.consumedQuantity : null}
                            isEditing={!!editingItem}
                            onEditClick={() => setMode('custom')}
                            onConfirm={(quantity) => {
                                const d = new Date();
                                const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

                                if (selectedDate > today) {
                                    setShowFutureModal(true)
                                    return
                                }

                                saveFoodToMeal(selectedFood._id, quantity);
                            }}
                        />
                    )}

                    {/* CUSTOM FOOD VIEW */}
                    {mode === 'custom' && (
                        <CustomFoodView
                            onFoodCreated={(newFood) => {
                                setSelectedFood(newFood);
                                setMode('details');
                            }}
                            food={selectedFood}
                        />
                    )}

                    {/* SCAN BARCIDE VIEW */}
                    {mode === 'scan' && (
                        <BarcodeScanner
                            onClose={() => setMode('choices')}
                            onScanSuccess={onScanSuccess}
                        />
                    )}

                </div>
            </div>
            <InfoModal
                show={showFutureModal}
                onHide={() => setShowFutureModal(false)}
                title="Date Not Available"
                description="You cannot log food for a future date. Please select today or a past date."
                icon={CalendarX}
            />
        </div>
    )
}
