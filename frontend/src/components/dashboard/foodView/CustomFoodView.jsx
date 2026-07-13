import React, { useState } from 'react';
import { Save, Loader2, ChevronDown, ChevronUpCircle, ChevronDownCircle } from 'lucide-react';
import { createFood, editFood } from '../../../services/FoodService';

export const CustomFoodView = ({ onFoodCreated, food }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showOptionals, setShowOptionals] = useState(false)

    const isEditingMode = !!food?._id

    const [formData, setFormData] = useState({
        name: food?.name || '',
        brand: food?.brand || 'Generic',
        category: food?.category || 'other',
        servingSize: food?.servingSize || 100,
        servingUnit: food?.servingUnit || 'g',
        kcal: food?.nutritionalValues?.kcal || '',
        carbsTotal: food?.nutritionalValues?.carbs?.total || '',
        carbsSugars: food?.nutritionalValues?.carbs?.sugars || '',
        proteins: food?.nutritionalValues?.proteins || '',
        fatsTotal: food?.nutritionalValues?.fats?.total || '',
        fatsSaturated: food?.nutritionalValues?.fats?.saturated || '',
        fibers: food?.nutritionalValues?.fibers || '',
        salt: food?.nutritionalValues?.salt || '',
        barcode: food?.barcode || undefined,
        source: food?.source || 'user'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        console.log(formData)
        try {
            let data
            if (isEditingMode) {
                data = await editFood(food._id, formData);
            } else {
                data = await createFood(formData);
            }

            if (onFoodCreated) {
                onFoodCreated(data.food);
            }

        } catch (err) {
            console.error(err);
            setError(isEditingMode ? 'Could not update food.' : 'Could not save custom food.')
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-2 p-2">
            {error && <div className="alert alert-danger radius-2xl small py-2">{error}</div>}
            <p className=" mt-4 mb-0 fw-bold text-primary-custom">General Info</p>
            <div className="d-flex flex-column gap-3 mb-2">
                {/* FOOD NAME */}
                <Field id="foodName" name="name" type="text" label="Food Name *" value={formData.name} onChange={handleChange} placeholder="e.g. Lasagna" required={true} maxWidth={'20rem'} />

                {/* FOOD BRAND */}
                <Field id="foodBrand" name="brand" type="text" label="Brand" value={formData.brand} onChange={handleChange} placeholder="Generic" maxWidth={'15rem'} />
                {/* FOOD BARCODE */}
                <Field id="foodBarcode" name="barcode" type="text" label="Barcode" value={formData?.barcode || ''} onChange={handleChange} maxWidth={'15rem'} />
            </div>

            <div className="d-flex flex-column gap-3">
                {/*CATEGORY SELECT */}
                <SelectField id="foodCategory" name="category" label="Category" value={formData.category} onChange={handleChange} maxWidth={'12rem'} />
                {/* PORTION SIZE */}
                <Field id="servingSize" name="servingSize" type="number" label="Portion Size *" value={formData.servingSize} onChange={handleChange} placeholder="100" required={true} maxWidth={'7rem'} />
                {/* UNIT SELECT */}
                <div className="d-flex flex-row align-items-center justify-content-between gap-4" style={{ '--dynamic-focus': 'var(--primary-muted)' }}>
                    <label htmlFor="servingUnit" className="small text-muted-foreground fw-bold ms-1">Unit</label>
                    <select id="servingUnit" name="servingUnit" value={formData.servingUnit} onChange={handleChange} className="form-select profile-input form-select-lg bg-light input-field" style={{ maxWidth: '7rem' }}>
                        <option value="g">g</option>
                        <option value="ml">ml</option>
                    </select>

                </div>
            </div>

            <p className=" mt-4 mb-0 fw-bold text-primary-custom">Nutritional Values (for {formData.servingSize}{formData.servingUnit})</p>

            {/* NECESSARY MACRO  */}
            <div className="d-flex flex-column gap-3">
                {/* KCAL */}
                <Field id="foodKcal" name="kcal" label="Calories (kcal) *" value={formData.kcal} onChange={handleChange} placeholder="0" min={0} maxWidth={'7rem'} focusColor={'var(--water)'} />
                {/* CARBS */}
                <Field id="foodCarbsTotal" name="carbsTotal" label="Carbs (g) *" value={formData.carbsTotal} onChange={handleChange} placeholder="0" min={0} maxWidth={'7rem'} focusColor={'var(--carbs)'} />
                {/* PROTEIN */}
                <Field id="foodProteins" name="proteins" label="Proteins (g) *" value={formData.proteins} onChange={handleChange} placeholder="0" min={0} maxWidth={'7rem'} focusColor={'var(--protein)'} />
                {/* FATS */}
                <Field id="foodFatsTotal" name="fatsTotal" label="Fats (g) *" value={formData.fatsTotal} onChange={handleChange} placeholder="0" min={0} maxWidth={'7rem'} focusColor={'var(--fat)'} />
            </div>

            <p
                className=" mb-0 mt-4 fw-bold cursor-pointer text-primary-custom d-flex gap-2 align-items-center"
                onClick={() => {
                    setShowOptionals(!showOptionals)
                }}
            >
                {showOptionals ? (
                    <>
                        <ChevronUpCircle />
                        Hide
                    </>
                ) : (
                    <>
                        <ChevronDownCircle />
                        Show all
                    </>
                )
                }
            </p>

            {/* OPTIONALS */}
            <div className={`d-flex flex-column gap-3 ${showOptionals ? '' : 'd-none'}`}>
                {/* SUGARS */}
                <Field id="foodCarbsSugars" name="carbsSugars" label="Sugars (g)" value={formData.carbsSugars} onChange={handleChange} placeholder="0" min={0} maxWidth={'7rem'} focusColor="var(--carbs-foreground)" />
                {/* SATURATED FATS */}
                <Field id="foodFatsSaturated" name="fatsSaturated" label="Sat. Fat (g)" value={formData.fatsSaturated} onChange={handleChange} placeholder="0" min={0} maxWidth={'7rem'} focusColor="var(--fat-foreground)" />

                {/* FIBERS */}
                <Field id="foodFibers" name="fibers" label="Fibers (g)" value={formData.fibers} onChange={handleChange} placeholder="0" min={0} maxWidth={'7rem'} focusColor="var(--protein-foreground)" />
                {/* SALT */}
                <Field id="foodSalt" name="salt" label="Salt (g)" value={formData.salt} onChange={handleChange} placeholder="0" min={0} maxWidth={'7rem'} focusColor="var(--accent-foreground)" />
            </div>

            {/* SAVE/EDIT BUTTON */}
            <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary-custom btn-lg  mx-auto text-nowrap  radius-2xl d-flex justify-content-center align-items-center gap-2 shadow-soft mt-3 add-custom-food-btn"
            >
                {isLoading ? <Loader2 className="animate-spin" size={22} /> : <Save size={22} />}
                <span className="font-heading fw-bold">
                    {isEditingMode ? 'Update Product' : 'Add Custom Food'}
                </span>
            </button>
        </form>
    )
}

const CATEGORY_OPTIONS = ['fruit', 'vegetable', 'meat', 'dairy', 'cereal', 'snack', 'beverage', 'other'];

const SelectField = ({ id, label, name, value, onChange, maxWidth, focusColor }) => {
    return (
        <div className="d-flex flex-row align-items-center gap-1" style={{ '--dynamic-focus': focusColor || 'var(--primary-muted)' }}>
            <label htmlFor={id} className="small text-muted-foreground fw-bold ms-1 w-100">
                {label}
            </label>
            <select
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                className="form-select form-select-lg profile-input px-3 text-capitalize input-field"
                style={{ maxWidth: maxWidth }}
            >
                {CATEGORY_OPTIONS.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>
        </div>
    );
}

const Field = ({ id, label, name, value, onChange, placeholder, type = 'number', required = false, min, maxWidth, focusColor, disabled = false }) => {
    return (
        <div className="d-flex flex-row align-items-center justify-content-between gap-4" style={{ '--dynamic-focus': focusColor || 'var(--primary-muted)' }}>
            <label htmlFor={id} className="small text-muted-foreground fw-bold ms-1 text-nowrap">
                {label}
            </label>
            <input
                id={id}
                name={name}
                type={type}
                inputMode={type === 'number' ? 'numeric' : undefined}
                value={value}
                step={type === 'number' ? 'any' : undefined}
                onChange={onChange}
                placeholder={placeholder}
                className="form-control form-control-lg  profile-imputpx-3 input-field"
                required={required}
                min={min}
                style={{ maxWidth: maxWidth }}
                disabled={disabled}
            />
        </div>
    );
}