const FoodSchema = require('./foods.schema')

const getFoods = async (searchQuery='') =>{
    const filter = searchQuery ? {name: { $regex: searchQuery, $options: 'i'}} : {}
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
    return await FoodSchema.findByIdAndDelete(id)
}

module.exports = {
    getFoods,
    getFoodById,
    createFood,
    editFood,
    deleteFood
}