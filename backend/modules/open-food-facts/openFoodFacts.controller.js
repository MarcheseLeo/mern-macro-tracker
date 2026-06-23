const OpenFoodFactsService = require('./openFoodFacts.service')

const getProductByBarcode = async (req, res, next) => {
    try {
        const { barcode } = req.params

        const food = await OpenFoodFactsService.getProductByBarcode(barcode)

        if (!food) {
            return res.status(404)
                .send({
                    statusCode: 404,
                    message: "Product not found on OpenFoodFacts"
                })
        }

        res.status(200)
            .send({
                statusCode: 200,
                message: "Product imported successfully",
                food
            })
    } catch (e) {
        next(e)
    }
}

module.exports = {
    getProductByBarcode
}