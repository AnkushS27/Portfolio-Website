const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const twilio = require('twilio');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(bodyParser.json({ limit: '10mb' }));

app.use((req, res, next) => {
  const nonce = generateNonce(); // Generate a random nonce value

  res.setHeader(
    'Content-Security-Policy',
    `default-src 'self'; style-src 'self' 'unsafe-inline' https://cdn.quilljs.com https://cdnjs.cloudflare.com; script-src 'self' https://cdn.quilljs.com 'nonce-${nonce}'; img-src 'self' data:; font-src 'self' https://cdnjs.cloudflare.com;`
  );

  res.locals.nonce = nonce; // Make nonce accessible in templates if needed

  next();
});

function generateNonce() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let nonce = '';
  for (let i = 0; i < 16; i++) {
    nonce += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return nonce;
}


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

app.get("/thanksforcontacting", function(req, res){
    res.render("thanksforcontacting");
});



// Contact form
app.post('/send-message', (req, res) => {
    const { clientName, clientEmail, clientMessage } = req.body;
  
    // Send a notification using Twilio
    const accountSid = 'AC7f53e5c9c37961a93a51bbc58b526cef';
    const authToken = 'ab0641e7efcc67ec8ee88060cdeee04e';
    const client = twilio(accountSid, authToken);
  
    client.messages
      .create({
        body: `New message from your website\nName: ${clientName}\nEmail: ${clientEmail}\nMessage: ${clientMessage}`,
        from: '+14067095277',
        to: '+918869045957',
      })
      .then((message) => console.log('Notification sent:', message.sid))
      .catch((error) => console.error(error));
      
      res.redirect("/thanksforcontacting");
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