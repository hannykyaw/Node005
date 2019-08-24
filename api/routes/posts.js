var express = require('express');
var router = express.Router();
var Post = require('../../model/post');
var multer = require('multer');
var bcrypt = require('bcrypt');
var upload = multer({ dest: 'public/images/uploads'});
var checkAuth = require('../middleware/check-auth');
router.get('/', function(req, res){
  res.status(200).json({
    message: 'User Home'
  });
});

router.get('/list',checkAuth,function(req, res){
  Post.find({}).populate('author').exec(function(err, rtn){
    if(err){
      res.status(500).json({
        message: 'Server Error',
        error: err
      })
    }
    console.log(rtn);
    if(rtn.length < 1){
      res.status(204).json({
        message: 'No Content Find'
      })
    }else{
      res.status(200).json({
        posts: rtn
      })
    }
  })
})

router.get('/detail/:id', checkAuth,function(req, res){
  Post.find({}).populate('author').exec(function(err, rtn){
    if(err){
      res.status(500).json({
        message: 'Server Error',
        error: err
      })
    }else{
      if(rtn == null){
        res.status(204).json({
          message: 'Not Content Found'
        })
      }else {
        res.status(200).json({
          user:rtn
        })
      }
    }
  })
})
router.delete('/:id',checkAuth, function (req, res){
  Post.findByIdAndRemove(req.params.id, function(err, rtn){
  if(err){
    res.status(500).json({
      message: 'Server Error',
      error: err
    })
  }else{
    res.status(200).json({
      message: 'Post deleted'
    })
  }
})
})

router.post('/add', checkAuth, upload.single('photo'),function(req, res){
  var post = new Post();
  post.title = req.body.title;
  post.content = req.body.content;
  post.author = req.body.author;
        post.save(function(err, rtn){
          if(err){
            res.status(500).json({
              message: 'Server Error',
              error: err
            })
          }else{
            res.status(201).json({
              message: 'Post Account created',
              data: rtn
            })
          }
        })
      })

router.patch('/:id', checkAuth,function(req,res){
  var updateOps ={}
  for(var ops of req.body){
    updateOps[ops.proName] = ops.value;
  }
  Post.findByIdAndUpdate(req.params.id, {$set: updateOps}, function(err, rtn){
    if(err){
      res.status(500).json({
        message: 'Sever Error',
        error: err
      })
    }else{
      res.status(200).json({
        message:'Post Account Modified'
      })
    }
  })
})

module.exports = router;
