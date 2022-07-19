const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Post = mongoose.model('Post')
//middleware
const requireLogin = require('../middleware/requireLogin')

router.get('/allPost',requireLogin, async (req,res) => {
    const posts= await Post.find().populate('postedBy','_id name') //populating postedBy id with its details
    res.json({posts})
})

router.get('/followersPost',requireLogin, async (req,res) => {
    const posts= await Post.find({postedBy: {$in:req.user.following}}).populate('postedBy','_id name') //populating postedBy id with its details
    res.json({posts})
})

router.get('/myPosts',requireLogin, async (req,res) => {
    const myPost = await Post.find({postedBy:req.user._id}).populate('postedBy', '_id name')
    res.json({myPost})
})

router.post('/createPost', requireLogin, async (req,res) => {
    const {title,body,pic} = req.body
    console.log(req.body)
    if(!title || !body || !pic) return res.json({'msg':'error'})
    req.user.password = undefined
    const post = new Post({
        title,
        body,
        photo:pic,
        postedBy: req.user
    })
    await post.save()
    res.json({post})
})

router.put('/like', requireLogin, (req,res) => {
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes: req.user._id}
    },{
        new: true
    }).exec( (err, result) => {
        if(err) return res.json({err:error})
        else return res.json({result})
    })
})

router.put('/unLike', requireLogin, (req,res) => {
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes: req.user._id}
    },{
        new: true
    }).exec( (err, result) => {
        if(err) return res.json({err:error})
        else return res.json({result})
    })
})

router.put('/comment', requireLogin, (req,res) => {
    const comment = {
        text: req.body.text,
        commentedBy: req.user.name
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments: comment}
    },{
        new: true
    })
    .exec( (err, result) => {
        if(err) return res.json({error: err})
        else return res.json({result})
    })
})

router.delete('/delete/:id', requireLogin, async (req,res) => {
     await Post.findByIdAndDelete({_id:req.params.id}, (err,post) => {
        if(err) return res.json({error: err})
        else return res.json({post})
     })
})

router.put('/delete/:id', requireLogin, async (req,res) => {
    Post.findByIdAndUpdate(req.params.id,{
        $pull:{comments: {_id: req.body.id}}
    },{
        new: true
    }).exec( (err, result) => {
        if(err) return res.json({err:error})
        else return res.json({result})
    })
})

module.exports = router