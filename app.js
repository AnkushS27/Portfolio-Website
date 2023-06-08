const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

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
app.get("/blog", function(req, res){
    res.render("blog");
});

// var day = "";

// app.get("/contact", function(req, res){
//     day = "xyz";
//     res.render("abcd", {kindofday: day});
// });

app.listen(3000, function(){
    console.log("Server is started at port 3000..");
});