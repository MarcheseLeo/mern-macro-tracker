const FoodSchema = require('./foods.schema')

const getFoods = async (searchQuery='') =>{
    const filter = { isActive: true }

    if (searchQuery) {
        filter.name = { $regex: searchQuery, $options: 'i' }
    }
    return await FoodSchema.find(filter)
}

const getFoodById = async(id)=>{
    return await FoodSchema.findById(id)
}

const createFood = async(body) =>{
    const newFood = new FoodSchema(body)
    return await newFood.save()
}

const editFood = async(id, body)=>{
    const updatedFood = await FoodSchema.findByIdAndUpdate(id, body, {new:true})
    return updatedFood
}

const deleteFood = async(id) =>{
    const deletedFood = await FoodSchema.findByIdAndUpdate(id, {isActive: false }, {new: true})
    return deleteFood
}

module.exports = {
    getFoods,
    getFoodById,
    createFood,
    editFood,
    deleteFood
}