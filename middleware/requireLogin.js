const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/info')
const mongoose = require('mongoose')
const User = mongoose.model('User')

module.exports = (req,res,next)=> {
    const {authorization} = req.headers
    //authorization ---> Bearer (bdbkr3biucbnjbcbk)token
    if(!authorization) return res.json({'msg':'no auth'})
    const token =  authorization.replace("Bearer ","")
    jwt.verify(token,JWT_SECRET, (err,payload) => {
        if(err) return res.json({'msg':'err'})

        const {_id} = payload
        User.findById(_id).then( user =>{
        req.user = user
        next()
        })
    })
}