const DailyMetricSchema = require('./dailyMetrics.schema')

const updateWater = async(userId, dateString, amountToAdd) =>{
    const targetDate = dateString ?  new Date(dateString) : new Date()
    targetDate.setUTCHours(0,0,0,0)
    
    const metric = await DailyMetricSchema.findOneAndUpdate(
        {user: userId, date: targetDate},
        {$inc: {waterAmount: amountToAdd}},
        {new: true, upsert: true, setDefaultsOnInsert: true}
    )

    if(metric.waterAmount < 0){
        metric.waterAmount = 0
        await metric.save()
    }

    return metric
}

module.exports = {
    updateWater
}