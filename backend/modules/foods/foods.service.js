const foodSchema = require('./foods.schema')

const getFoods = async (searchQuery='') =>{
    const filter = searchQuery ? {name: { $regex: searchQuery, $options: 'i'}} : {}
    return await foodSchema.find(filter)
}

const getFoodById = async(id)=>{
    return await foodSchema.findById(id)
}

const createFood = async(body) =>{
    const newFood = new foodSchema(body)
    return await newFood.save()
}

const editFood = async(id, body)=>{
    const updatedFood = await foodSchema.findByIdAndUpdate(id, body, {new:true})
    return updatedFood
}

const deleteFood = async(id) =>{
    return await foodSchema.findByIdAndDelete(id)
}

module.exports = {
    getFoods,
    getFoodById,
    createFood,
    editFood,
    deleteFood
}