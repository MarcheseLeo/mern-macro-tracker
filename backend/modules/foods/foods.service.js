const FoodSchema = require('./foods.schema')

const getFoods = async ({ name = '', category = '',barcode = '', page = 1, limit = 15 }) =>{
    const filter = { isActive: true }

    if (name) {
        filter.name = { $regex: name, $options: 'i' };
    }

    if (category && category !== 'All') {
        filter.category = category;
    }

    if(barcode){
        filter.barcode = barcode
    }
    
    const skip = (page - 1) * limit
    const [foods, totalItems] = await Promise.all([
        FoodSchema.find(filter).skip(skip).limit(Number(limit)),
        FoodSchema.countDocuments(filter)
    ])
    const totalPages = Math.ceil(totalItems / limit)
    return { 
        foods, 
        totalPages, 
        currentPage: Number(page),
        totalItems
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