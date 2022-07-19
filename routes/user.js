const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Post = mongoose.model('Post')
const User = mongoose.model('User')
//middleware
const requireLogin = require('../middleware/requireLogin')

router.get('/user/:id', requireLogin, async (req,res) => {
    try {
        const user = await User.findOne({_id: req.params.id}).select('-password')
        const posts = await Post.find({postedBy: req.params.id}).populate('postedBy', '_id name')
        res.json({user, posts})
    } catch(err) {
        res.json({error: err})
    }
})

router.put('/follow',requireLogin, async (req,res) => {
   await User.findByIdAndUpdate(req.body.id, {
        $push: {followers: req.user._id}
    }, {
        new: true
    }
    ,(err,result) => {
        if(err) return res.json({error: err})
        User.findByIdAndUpdate(req.user._id, {
            $push: {following: req.body.id}
        },{
            new: true
        }).select('-password').then(result => {
            return res.json(result)
        }).catch(err => {
            res.json({error: err})
        })
    })
})

router.put('/unFollow',requireLogin, async (req,res) => {
    await User.findByIdAndUpdate(req.body.id, {
        $pull: {followers: req.user._id}}, {
            new: true
        },
        (err,result) => {
        if(err) return res.json({error: err})
         User.findByIdAndUpdate(req.user._id, {
            $pull: {following: req.body.id}
        }, {
            new: true
        }).select('-password').then(result => {
            return res.json(result)
        }).catch(err => {
            res.json({error: err})
        })
    })
})

router.put('/updatePic', requireLogin, async (req,res) => {
    await User.findByIdAndUpdate(req.user._id, {$set:{url: req.body.url}},{new: true}, (err,result) => {
        if(err) return res.json({error: err})
        else return res.json(result)
    })
})

module.exports = router