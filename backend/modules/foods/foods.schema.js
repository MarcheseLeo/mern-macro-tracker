const mongoose = require('mongoose')

const FoodSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String,
    },
    brand: {
        type: String,
        default: 'Generic'
    },
    servingSize: {
        required: true,
        type: Number,
        min: 1
    },
    servingUnit: {
        type: String,
        enum: ['g', 'ml'],
        default: 'g'
    },
    nutritionalValues: {
        kcal: { type: Number, required: true, min: 0 },
        fats: {
            total: { type: Number, required: true, min: 0 },
            saturated: { type: Number, default: 0, min: 0 }
        },
        carbs: {
            total: { type: Number, required: true, min: 0 },
            sugars: { type: Number, default: 0, min: 0 }
        },
        proteins: { type: Number, required: true, min: 0 },
        fibers: { type: Number, required: true, min: 0 },
        salt: { type: Number, required: true, min: 0 },
    },
    barcode: { type: String, unique: true, sparse: true },
    source: { 
        type: String, 
        enum: ['user', 'openfoodfacts', 'admin'],
        default: 'user' 
    },
    category: {
        type: String,
        enum: ['fruit', 'vegetable', 'meat', 'dairy', 'cereal', 'snack', 'beverage', 'other'],
        default: 'other'
    },
    nutritionBasis: {
        type: String,
        enum: ['per_100', 'per_serving'],
        default: 'per_100'
    }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })

FoodSchema.virtual('foodLabel').get(function () {
    return `${this.brand} - ${this.name} (${this.servingSize}${this.servingUnit})`
})

FoodSchema.virtual('servingKcal').get(function () {
    if (this.nutritionBasis === 'per_serving') {
        return this.nutritionalValues.kcal;
    }

    const actualKcal = (this.nutritionalValues.kcal / 100) * this.servingSize;
    return Math.round(actualKcal);
})

FoodSchema.virtual('calculatedKcal').get(function () {
    const macrosKcal =
        (this.nutritionalValues.carbs.total * 4) +
        (this.nutritionalValues.proteins * 4) +
        (this.nutritionalValues.fats.total * 9)
    return Math.round(macrosKcal);
})

module.exports = mongoose.model('food', FoodSchema, 'foods')

