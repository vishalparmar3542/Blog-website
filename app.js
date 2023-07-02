//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
require("dotenv").config();

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const mongoose = require("mongoose");
const dburl = process.env.DATABASE;
console.log(dburl);
mongoose.connect(dburl, { useNewUrlParser: true, }).then(() => {
  console.log("connected");
}).catch(err => console.log("some error while connecting" + err));

const blogschema = new mongoose.Schema({
  title: String,
  content: String,
  author:String
});
const database = mongoose.model("Blog", blogschema);
const homeStartingContent ="Welcome to the Developer Journal, where coding enthusiasts gather to share their insights, experiences, and discoveries. Prepare to embark on a captivating journey through the realms of software development, where innovation and creativity know no bounds. Join our community of developers, as we delve into the intricacies of code and unravel the endless possibilities that lie ahead"
  const aboutContent ="DeveloperMania is a vibrant online community dedicated to fostering the growth and collaboration of developers worldwide. With a passion for all things related to software development, coding, and technology, DeveloperMania provides a platform for developers of all levels to connect, learn, and share their knowledge and experiences. Whether you're a seasoned professional or just starting your coding journey, DeveloperMania offers a supportive environment where developers can engage in discussions, access valuable resources, and stay up-to-date with the latest trends and innovations in the industry. Join DeveloperMania today and become part of a dynamic community that celebrates the art and science of programming.";
const contactContent ="We would love to hear from you! If you have any questions, feedback, or inquiries, please don't hesitate to reach out to us. Our team at DeveloperMania is dedicated to providing a seamless experience for our readers and community members.\r\n"
  +"If you have any suggestions for article topics, want to contribute as a guest writer, or have any general inquiries, feel free to contact us using the form below. We appreciate your interest in DeveloperMania and value your input.\r\n"
  +"Additionally, if you have encountered any technical issues on our website or need assistance with navigating the platform, please let us know. Our support team will be more than happy to assist you.\r\n"
  +"Thank you for being a part of DeveloperMania. We look forward to connecting with you and continuing to provide valuable content and resources for the daily journal of DeveloperMania.\r\n";




let posts=[];

app.get("/", (req, res) => {
  database.find().then((dbposts) => {
    
    //console.log(posts);
    res.render("home", { homeContent: homeStartingContent, posts: dbposts });
    posts = dbposts;
  });
  
});
app.get("/contact", (req, res) => {
  res.render("contact", { contactContent: contactContent });
});
app.get("/about", (req, res) => {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/compose", (req, res) => {
  res.render("compose", {});
});


app.get("/posts/:postid", (req, res) => {
  console.log(req.params.postid)
  let found = false;
  let rqid = req.params.postid;

  database.findById({ _id: rqid }).then((post) => {
    console.log(post);
    res.render("post", { post: post });
    found = true;
  }).catch((err) => {
    res.send("Post not found [May be deleted conatact devloper]");
  })
  
    
    
});

app.post("/compose", (req, res) => {
  
  
  const newpost = new database({
    title: req.body.postTitle,
    content: req.body.postBody,
    author:"Default"
  })
  newpost.save().then(()=>console.log("Post saved to db"));

  
  res.redirect("/");

});
app.listen(process.env.PORT || 5500 , () => {
  console.log("server started");
 
});


