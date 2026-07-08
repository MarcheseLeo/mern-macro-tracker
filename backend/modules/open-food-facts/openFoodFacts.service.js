const FoodService= require('../foods/foods.service')

const getProductByBarcode = async (barcode) => {
    try {
        const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`, {
            headers: {     
                'User-Agent': 'MacroTracker_CapstoneProject - Web - Version 1.0 - contact: leonardo.lol.ldp@gmail.com'
            }
        })
        const data = await response.json()

        if (data.status !== 1) {
            return null
        }

        const product = data.product
        const { nutriments } = product || {}

        const mappedFood = {
            name: product.product_name || 'Unknown product',
            brand: product.brands || 'Generic',
            servingSize: product.serving_quantity || 100,
            servingUnit: 'g',
            nutritionalValues: {
                kcal: nutriments['energy-kcal_100g'] || 0,
                fats: {
                    total: nutriments['fat_100g'] || 0,
                    saturated: nutriments['saturated-fat_100g'] || 0,
                },
                carbs: {
                    total: nutriments['carbohydrates_100g'] || 0,
                    sugars: nutriments['sugars_100g'] || 0,
                },
                proteins: nutriments['proteins_100g'] || 0,
                fibers: nutriments['fiber_100g'] || 0,
                salt: nutriments['salt_100g'] || 0
            },
            barcode: barcode,
            source: 'openfoodfacts'
        }

        const food = await FoodService.createFood(mappedFood)
        return food

    } catch (e) {
        console.error("Errore durante la chiamata a OpenFoodFacts:", e)
        throw new Error("Errore di comunicazione con OpenFoodFacts")
    }
}

module.exports = {
    getProductByBarcode
}