const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(bodyParser.json({ limit: '10mb' }));

app.set('view engine', 'ejs');

// Routes for different pages
app.get("/", function(req, res){
    res.render("home");
});

app.get("/portfolio", function(req, res){
    res.render("portfolio");
});
app.get("/about", function(req, res){
    res.render("about");
});
app.get("/contact", function(req, res){
    res.render("contact");
});

// Blog logic
mongoose.connect("mongodb+srv://Ankush7163:ankushsingh490@cluster0.f50reqx.mongodb.net/myBlogDB", {useNewUrlParser: true, useUnifiedTopology: true});

const postSchema = {
    title: String,
    content: String,
    currentDate: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/composeBlog", function(req, res){
    const currDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month:'numeric', day: 'numeric' }); // Get the current date
    res.render("compose_blog", { currDate: currDate });
});

app.get("/blog", function(req, res){

    Post.find({}, function(err, posts){
      res.render("blog", {
        posts: posts
        });
    });
});

app.get("/blog/posts/:postId", function(req, res){

    const requestedPostId = req.params.postId;
    
      Post.findOne({_id: requestedPostId}, function(err, post){
        res.render("post", {
          title: post.title,
          content: post.content,
          currentDate: post.currentDate
        });
      });
    
});

// Post requests
app.post("/compose", function(req, res){
    const post = new Post({
        title: req.body.postTitle,
        content: req.body.postBody,
        currentDate: req.body.postDate
      });
    
    
      post.save(function(err){
        if (!err){
            res.redirect("/blog");
        }
      });
})



// var day = "";

// app.get("/contact", function(req, res){
//     day = "xyz";
//     res.render("abcd", {kindofday: day});
// });

app.listen(3000, function(){
    console.log("Server is started at port 3000..");
});