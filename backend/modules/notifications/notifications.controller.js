const NotificationService = require('./notifications.service')

const getNotifications = async(req, res, next) =>{
    try{
        const {id: userId} = req.user
        const notifications = await NotificationService.getNotifications(userId)

        res.status(200).send(notifications)
    }catch(e){
        next(e)
    }
}

const markAsRead = async(req, res, next) =>{
    try{
        const {id} = req.params
        await NotificationService.markAsRead(id)

        res.status(200).send({ message: 'Notification marked as read' })
    }catch(e){
        next(e)
    }
}

const createAchievementNotification = async(req, res, next) =>{
    try{
        const {id: userId} = req.user
        const {message} = req.body
        await NotificationService.createAchievementNotification(userId, message)
        res.status(200).send({ message: 'Ok' })
    }catch(e){
        next(e)
    }
}

module.exports = {
    getNotifications,
    markAsRead, 
    createAchievementNotification
}