import api from "./api"

export const getFoods = async (url) => {

    const res = await api.get(url)

    return res.data
}

export const getFoodByBarcode = async (barcode) =>{
    const res = await api.get(`/foods/import/barcode/${barcode}`)
    return res.data.food
}

export const createFood = async (formData) => {
    const body = {
        name: formData.name,
        brand: formData.brand,
        servingSize: Number(formData.servingSize),
        servingUnit: formData.servingUnit,
        category: formData.category,
        source: 'user',
        nutritionalValues: {
            kcal: Number(formData.kcal),
            carbs: {
                total: Number(formData.carbsTotal),
                sugars: Number(formData.carbsSugars) || 0
            },
            proteins: Number(formData.proteins),
            fats: {
                total: Number(formData.fatsTotal),
                saturated: Number(formData.fatsSaturated) || 0
            },
            fibers: Number(formData.fibers) || 0,
            salt: Number(formData.salt) || 0
        },
        barcode: formData.barcode,
        source: formData.source
    }

    const res = await api.post('/foods', body)
        
    return res.data
}