const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    firstName: {
        required: true,
        type: String
    },
    lastName: {
        required: true,
        type: String,
    },
    email:{
        required: true,
        unique: true,
        type: String,
    },
    password:{
        required: function(){
            return !this.googleId
        },
        type: String,
        minLength: 8
    },
    googleId: {
        type: String
    },
    dob: {
        type: Date
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'not specified'],
        default: 'not specified' 
    },
    height:{
        type: mongoose.Schema.Types.Double
    }
}, {timestamps: true, strict: true})

module.exports = mongoose.model('user',UserSchema, 'Users')