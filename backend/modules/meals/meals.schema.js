const mongoose = require('mongoose')

const MealSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    mealType: {
        type: String,
        enum: ['breakfast', 'lunch', 'dinner', 'snack'],
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    items: {
        type: [{
            foodId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'food',
                required: true
            },
            consumedQuantity: {
                type: Number,
                min: 1,
                required: true
            }
        }],
        validate: {
            validator: value => Array.isArray(value) && value.length > 0,
            message: 'items must contain at least one food'
        }
    }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })

MealSchema.virtual('totalMealKcal').get(function () {
    if (!this.items || this.items.length === 0) {
        return 0;
    }

    const total = this.items.reduce((sum, item) => {

        if (item.foodId && item.foodId.nutritionalValues) {

            const rowKcals = item.foodId.nutritionalValues.kcal
            const consumedQuantity = item.consumedQuantity
            const actualKcals = (rowKcals / 100) * consumedQuantity

            return sum + actualKcals
        }
        return sum
    }, 0)

    return Math.round(total)
})

MealSchema.virtual('totalMealFats').get(function () {
    if (!this.items || this.items.length === 0) {
        return {
            total: 0,
            saturated: 0
        }
    }

    const total = this.items.reduce((sum, item) => {
        if (item.foodId && item.foodId.nutritionalValues) {
            const { total: rowTotal, saturated: rowSaturated } = item.foodId.nutritionalValues.fats
            const consumedQuantity = item.consumedQuantity

            const actualTotal = (rowTotal / 100) * consumedQuantity
            const actualSaturated = (rowSaturated / 100) * consumedQuantity

            return {
                total: sum.total + actualTotal,
                saturated: sum.saturated + actualSaturated
            }
        }

        return sum
    }, {
        total: 0,
        saturated: 0
    })

    return {
        total: Math.round(total.total),
        saturated: Math.round(total.saturated)
    }
})

MealSchema.virtual('totalMealCarbs').get(function () {
    if (!this.items || this.items.length === 0) {
        return {
            total: 0,
            sugars: 0
        }
    }

    const total = this.items.reduce((sum, item) => {
        if (item.foodId && item.foodId.nutritionalValues) {
            const { total: rowTotal, sugars: rowSugars} = item.foodId.nutritionalValues.carbs
            const consumedQuantity = item.consumedQuantity

            const actualTotal = (rowTotal / 100) * consumedQuantity
            const actualSugars = (rowSugars / 100) * consumedQuantity

            return {
                total: sum.total + actualTotal,
                sugars: sum.sugars + actualSugars
            }
        }

        return sum
    }, {
        total: 0,
        sugars: 0
    })

    return {
        total: Math.round(total.total),
        sugars: Math.round(total.sugars)
    }
})


MealSchema.virtual('totalMealProteins').get(function () {
    if (!this.items || this.items.length === 0) {
        return 0;
    }

    const total = this.items.reduce((sum, item) => {

        if (item.foodId && item.foodId.nutritionalValues) {

            const {proteins: rowProteins} = item.foodId.nutritionalValues
            const consumedQuantity = item.consumedQuantity
            const actualProteins = (rowProteins / 100) * consumedQuantity

            return sum + actualProteins
        }
        return sum
    }, 0)

    return Number(total.toFixed(1))
})

MealSchema.virtual('totalMealFibers').get(function () {
    if (!this.items || this.items.length === 0) {
        return 0;
    }

    const total = this.items.reduce((sum, item) => {

        if (item.foodId && item.foodId.nutritionalValues) {

            const {fibers: rowFibers} = item.foodId.nutritionalValues
            const consumedQuantity = item.consumedQuantity
            const actualFibers = (rowFibers / 100) * consumedQuantity

            return sum + actualFibers
        }
        return sum
    }, 0)

    return Number(total.toFixed(1))
})

MealSchema.virtual('totalMealSalt').get(function () {
    if (!this.items || this.items.length === 0) {
        return 0;
    }

    const total = this.items.reduce((sum, item) => {

        if (item.foodId && item.foodId.nutritionalValues) {

            const {salt: rowSalt} = item.foodId.nutritionalValues
            const consumedQuantity = item.consumedQuantity
            const actualSalt = (rowSalt / 100) * consumedQuantity

            return sum + actualSalt
        }
        return sum
    }, 0)

    return Number(total.toFixed(1))
})

module.exports = mongoose.model('meal', MealSchema, 'meals')