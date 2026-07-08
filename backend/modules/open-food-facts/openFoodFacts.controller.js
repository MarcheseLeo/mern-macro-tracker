const OpenFoodFactsService = require('./openFoodFacts.service')
const FoodSchema = require('../foods/foods.schema')

const getProductByBarcode = async (req, res, next) => {
    try {
        const { barcode } = req.params

        const food = await FoodSchema.findOne({ barcode: barcode })

        if (!food) {
            const newFood = await OpenFoodFactsService.getProductByBarcode(barcode)

            if (!newFood) {
                return res.status(404)
                    .send({
                        statusCode: 200,
                        message: "No product found on OpenFoodFacts or in database",
                        food: null
                    })
            }

            res.status(200)
                .send({
                    statusCode: 200,
                    message: "Product imported successfully",
                    food: newFood
                })

        } else {
            return res.status(200)
                .send({
                    statusCode: 200,
                    food
                })
        }

    } catch (e) {
        next(e)
    }
}

module.exports = {
    getProductByBarcode
}