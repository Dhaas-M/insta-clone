const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/info')
const mongoose = require('mongoose')
const User = mongoose.model('User')
//middleware
const requireLogin = require('../middleware/requireLogin')


router.post('/', async (req,res) => {
    const { name, email, password, url} = req.body
    if(!name || !email || !password) return res.json({"error": "fill"})
    
    const savedUser = await User.findOne({email: email})
    if(savedUser) return res.json({'error':'user already registered'})
    const hashedPassword = await bcrypt.hash(password,12)
    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        url
    })
    await newUser.save()
    res.json({'msg':'saved'})
})

router.post('/signin', async (req,res) => {
    const {email,password} = req.body
    if(!email || !password) return res.json({'error':'invalid username or password'})
    const user = await User.findOne({email:email})
    if(!user) return res.json({'msg':'not user'})
    const canAllow = await bcrypt.compare(password,user.password)
    if(canAllow) {
        const token = jwt.sign({_id:user._id},JWT_SECRET)
        const {_id,name,email,followers,following,url} = user
        return res.json({token, user:{_id,name,email,followers,following,url}})
    }
    res.json({'error':'incorrect password'})
})

module.exports = router