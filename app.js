const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/UsersDB");
const userSchema = mongoose.Schema({
  Email: String,
  password: String
});
const User = new mongoose.model("user", userSchema);


app.get("/", (req, res)=>{
  res.render("home");
});

// registration part for new user

app.get("/register", (req, res)=>{
  res.render("register");
});

app.post("/register", (req, res)=>{
    const newUser = new User ({
        Email: req.body.username,
        password: req.body.password
    });
    newUser.save().then(res.render("secrets"));
});

// login part for user

app.get("/login", (req, res)=>{
  res.render("login");
});

app.post("/login", (req, res)=>{
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({Email: username}).then((foundUser)=>{
    if(foundUser){
      if(foundUser.password === password){
        res.render("secrets");
      }else{
        res.redirect("/login");
      }
    }else{
      res.redirect("/login");
    }
  });

});

// logout part for users

app.get("/logout", (req, res)=>{
  res.redirect("/");
});

// new post for users part

app.get("/submit", (req, res)=>{
  res.render("submit");
});

app.post("/submit", (req, res)=>{
  const postSchema = {
    content: String
  }
  const Post = new mongoose.model("psot", postSchema);
  const newPost = new Post ({
    content: req.body.secret
  });
  newPost.save().then(res.render("secrets", {mySecret: newPost.content}));
});


app.listen("3000", console.log("server is running on port 3000"));
