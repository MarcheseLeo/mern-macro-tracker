const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
    firstName: {
        required: true,
        type: String
    },
    lastName: {
        required: true,
        type: String,
    },
    email: {
        required: true,
        unique: true,
        type: String,
    },
    password: {
        required: function () {
            return !this.googleId
        },
        type: String,
        minLength: 8,
        select: false
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
    height: {
        type: mongoose.Schema.Types.Number
    },
    dailyKcalGoal: {
        type: Number,
        required: true,
        default: 2000
    }
}, {
    timestamps: true,
    strict: true,
    toJSON: {
        transform: function (doc, ret) {
            delete ret.password
            return ret
        }
    }
})

UserSchema.pre('save', async function () {
    if (!this.isModified('password') || !this.password) {
        return
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.pre('findOneAndUpdate', async function () {
    const update = this.getUpdate()
    const password = update.password || update.$set?.password

    if (!password) {
        return
    }

    const salt = await bcrypt.genSalt(10)
    const hashed = await bcrypt.hash(password, salt)

    if (update.$set?.password) {
        update.$set.password = hashed
    } else {
        update.password = hashed
    }

    this.setUpdate(update)
})
module.exports = mongoose.model('user', UserSchema, 'users')
