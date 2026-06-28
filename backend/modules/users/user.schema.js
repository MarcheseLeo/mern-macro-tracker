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
    weight: {
        type: Number
    },
    height: {
        type: Number
    },
    dailyKcalGoal: {
        type: Number,
        required: true,
        default: 2000
    },
    macroGoals: {
        carbs: {
            type: Number,
            required: true,
            default: 250
        },
        proteins: {
            type: Number,
            required: true,
            default: 120
        },
        fats: {
            type: Number,
            required: true,
            default: 65
        }
    },
    avatar: {
        type: String,
        required: false,
        default: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String
    }
}, {
    timestamps: true,
    strict: true,
    toObject: { virtuals: true },
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            delete ret.password
            return ret
        }
    }
})

UserSchema.virtual('age').get(function () {
    if (!this.dob) {
        return null
    }

    const today = new Date()
    const birthDate = new Date(this.dob)

    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age
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
