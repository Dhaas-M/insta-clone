const mongoose = require('mongoose')
//for relation
const {ObjectId} = mongoose.Schema.Types
const postSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    body:{
        type: String,
        required: true
    },
    photo:{
        type: String,
        default: "No photo"
    },
    likes:[
        {
            type: ObjectId,
            ref: "User"
        }
    ],
    comments: [
        {
            text: String,
            commentedBy: String
        }
    ],
    postedBy:{
        type: ObjectId,
        ref: "User"
    }  
})

mongoose.model('Post',postSchema)