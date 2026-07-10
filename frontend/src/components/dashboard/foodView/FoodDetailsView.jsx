import React, { useState, useEffect } from 'react'
import { Plus, Info} from 'lucide-react'
import { InfoModal } from '../../infoModal/Infomodal'


export const FoodDetailsView = ({ food, onConfirm }) => {

    const [quantity, setQuantity] = useState(100);
    const [selectMode, setSelectMode] = useState('100')

    const unit = food.servingUnit || 'g'

    const handleSelectChange = (e) => {
        const mode = e.target.value
        setSelectMode(mode)

        if (mode === '100') setQuantity(100)
        if (mode === 'serving') setQuantity(food.servingSize)
    }

    const handleInputChange = (e) => {
        const val = Number(e.target.value)
        setQuantity(val)

        if (val !== 100 && val !== food.servingSize) {
            setSelectMode('custom')
        } else if (val === 100) {
            setSelectMode('100')
        } else if (val === food.servingSize) {
            setSelectMode('serving')
        }
    }

    const calc = (valuePer100) => {
        if (!valuePer100) return 0;
        const actualValue = (valuePer100 / 100) * quantity;
        return Math.round(actualValue * 10) / 10;
    }

    const macros = food.nutritionalValues
    const currentKcal = Math.round((macros.kcal / 100) * quantity)

    return (
        <div className="d-flex flex-column">

            {/* HEADER */}
            <div className="text-center mb-4 mt-2">
                <h3 className="font-heading fw-bold mb-1">{food.name}</h3>
                <p className="text-muted small mb-0">{food.brand}</p>
            </div>

            {/* SUMMARY */}
            <div className="d-flex justify-content-center gap-4 gap-md-5 text-center bg-light radius-3xl p-3 mb-4 shadow-soft-sm">
                <div>
                    <span className="d-block font-heading fs-4 fw-bold text-primary">{currentKcal}</span>
                    <span className="small text-muted fw-medium">Kcal</span>
                </div>
                <div>
                    <span className="d-block font-heading fs-4 fw-bold text-carbs" ><span>{calc(macros.carbs?.total)}</span>g</span>
                    <span className="small text-muted fw-medium">Carbs</span>
                </div>
                <div>
                    <span className="d-block font-heading fs-4 fw-bold text-protein">{calc(macros.proteins)}g</span>
                    <span className="small text-muted fw-medium">Proteins</span>
                </div>
                <div>
                    <span className="d-block font-heading fs-4 fw-bold text-fat">{calc(macros.fats?.total)}g</span>
                    <span className="small fw-medium">Fats</span>
                </div>
            </div>



            {/* FULL MACRO TABLE */}
            <div className="flex-grow-1 overflow-y-auto mb-4 px-1">
                <h6 className="font-heading fw-bold mb-3 px-2 text-dark ">Nutritional Values</h6>
               <div className="bg-white border rounded-4 p-3 shadow-sm">
                    {/* Calories */}
                    <div className="d-flex justify-content-between align-items-center pb-2 border-bottom">
                        <span className="fw-bold text-dark">Calories</span>
                        <span className="font-heading fs-6 fw-bold text-primary">{currentKcal} kcal</span>
                    </div>

                    {/* Carbs */}
                    <div className="d-flex justify-content-between align-items-center pt-3 pb-1">
                        <div className="d-flex align-items-center gap-2">
                            <span className="rounded-circle bg-carbs" style={{ width: '8px', height: '8px' }}></span>
                            <span className="fw-bold text-dark">Total Carbs</span>
                        </div>
                        <span className="fw-bold text-carbs">{calc(macros.carbs?.total)} g</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center pb-2 mb-1 border-bottom ms-3 ps-2" style={{ borderLeft: '2px solid var(--border)' }}>
                        <span className="small text-muted fw-medium">Sugars</span>
                        <span className="small text-muted fw-bold">{calc(macros.carbs?.sugars)} g</span>
                    </div>

                    {/* Fats */}
                    <div className="d-flex justify-content-between align-items-center pt-2 pb-1">
                        <div className="d-flex align-items-center gap-2">
                            <span className="rounded-circle bg-fat" style={{ width: '8px', height: '8px' }}></span>
                            <span className="fw-bold text-dark">Total Fat</span>
                        </div>
                        <span className="fw-bold text-fat">{calc(macros.fats?.total)} g</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center pb-2 mb-1 border-bottom ms-3 ps-2" style={{ borderLeft: '2px solid var(--border)' }}>
                        <span className="small text-muted fw-medium">Saturated Fat</span>
                        <span className="small text-muted fw-bold">{calc(macros.fats?.saturated)} g</span>
                    </div>

                    {/* Protein */}
                    <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                        <div className="d-flex align-items-center gap-2">
                            <span className="rounded-circle bg-protein" style={{ width: '8px', height: '8px' }}></span>
                            <span className="fw-bold text-dark">Protein</span>
                        </div>
                        <span className="fw-bold text-protein">{calc(macros.proteins)} g</span>
                    </div>

                    {/* Fibers */}
                    <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                        <div className="d-flex align-items-center gap-2">
                            <span className="rounded-circle bg-secondary" style={{ width: '8px', height: '8px' }}></span>
                            <span className="fw-bold text-dark">Fibers</span>
                        </div>
                        <span className="fw-bold text-dark">{calc(macros.fibers)} g</span>
                    </div>

                    {/* Salt */}
                    <div className="d-flex justify-content-between align-items-center pt-2">
                        <div className="d-flex align-items-center gap-2">
                            <span className="rounded-circle bg-secondary" style={{ width: '8px', height: '8px' }}></span>
                            <span className="fw-bold text-dark">Salt</span>
                        </div>
                        <span className="fw-bold text-dark">{calc(macros.salt)} g</span>
                    </div>
                </div>
            </div>

            {/* SERVING SIZE */}
            <div className="bg-white border rounded-4 p-3 mb-4 shadow-sm">
                <label className="small fw-bold text-muted mb-2 d-flex align-items-center gap-1">
                    <Info size={14} /> Portion Size
                </label>
                <div className="d-flex gap-2 justify-content-center">
                    <div className="position-relative" style={{ width: '40%' }}>
                        <input
                            type="number"
                            className="form-control form-control-lg bg-light border-0 fw-bold"
                            value={quantity}
                            onChange={handleInputChange}
                            min="1"
                        />
                        <span className="position-absolute top-50 end-0 translate-middle-y pe-3 text-muted fw-medium">
                            {unit}
                        </span>
                    </div>

                    {/* SIZE SELECT */}
                    <select
                        className="form-select form-select-lg bg-light border-0 fw-medium"
                        style={{ width: '60%' }}
                        value={selectMode}
                        onChange={handleSelectChange}
                    >
                        <option value="100">100 {unit}</option>
                        <option value="serving">1 Serving ({food.servingSize} {unit})</option>
                        <option value="custom" disabled>Custom quantity</option>
                    </select>
                </div>
            </div>

            {/* ADD BUTTON */}
            <button
                className="btn btn-primary-custom btn-lg radius-2xl d-flex justify-content-center align-items-center gap-2 shadow-soft m-auto add-to-diary-btn"
                onClick={() => onConfirm(quantity)}

            >
                <Plus size={22} />
                <span className="font-heading fw-bold">Add to Diary</span>
            </button>

        </div>
    )
}
