const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
//user Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true,
        default: 'https://www.nicepng.com/png/detail/933-9332131_profile-picture-default-png.png'
    },
    followers: [
        {
            type: ObjectId,
            ref: 'User'
        }
    ],
    following: [
        {
            type: ObjectId,
            ref: 'User'
        }
    ]
})
//registering
mongoose.model('User', userSchema)