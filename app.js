//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose")

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique.";

const app = express();

app.set('view engine', 'ejs');

// Mongoose part
mongoose.connect('mongodb+srv://admin-alex:55331177@cluster0.jitkh.mongodb.net/blogPosts', {useNewUrlParser: true, useUnifiedTopology: true});
const blogPost = new mongoose.Schema({
  title: String,
  body: String
})
const Blogs = mongoose.model('Blogs', blogPost);

//hotplate continue
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){
  Blogs.find((err, blogs)=>{
    if(!err){
      res.render("home", {
        startingContent: homeStartingContent,
        posts: blogs
        });
    }
  })
  
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Blogs({
    title: req.body.postTitle,
    body: req.body.postBody
  });
  post.save();

  res.redirect("/");

});

app.get("/posts/:postId", function(req, res){
  const requestedTitle = req.params.postId;
  Blogs.findOne({_id: requestedTitle}, (err, blogs)=>{
    if(!err){
      res.render('post', {
        title: blogs.title,
        content: blogs.body
      })
    }
  })

});

let PORT = process.env.PORT || 3000

app.listen(PORT, function() {
  console.log(`app running in port ${PORT}`);
});
