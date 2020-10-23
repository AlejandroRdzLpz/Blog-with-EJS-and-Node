//jshint esversion:6

const dotenv = require('dotenv')
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose")

const homeStartingContent = "This is the basic blog of a JS student.";

const aboutContent = "I am an aspiring Web Dev and Mobile Dev from CDMX. This is an example of the technologies I am familiar with";
const contactContent = ["My email: lalolandino@gmail.com", 'My GutHub: https://github.com/AlejandroRdzLpz', 'My LinkedIn: https://www.linkedin.com/in/alejandro-rodriguez-lopez-57b150194/'];

const app = express();

app.set('view engine', 'ejs');

// Mongoose part
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});
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
