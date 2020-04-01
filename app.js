var express = require("express");
var app = express();
var session = require("express-session");

db = require("./model/main.js");
hash = require("./model/hash.js");

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  cookie: {maxAge: 60000},
  saveUninitialized: true,
}));
app.use(express.static("./public"));
app.set("view engine", "ejs");

// 首页
app.get("/",function(req,res){
  if(req.session.login == "1"){
    res.render("index",{
      login: true,
      text: "欢迎 "+ req.session.username
    });
  }else{
    res.render("index",{
      login: false,
      text: "你没有登录"
    });
  }
})

// 注册
app.get("/register",function(req,res){
  res.render("register")
})
app.get("/add",function(req,res){
  db.insertOne("test","users",{
    "username": req.query.username,
    "password": hash.hash(req.query.password)
  },function(err,result){
    if(err){
      res.send(err);
      return;
    }
    res.send("注册成功");
  })
})

// 登录
app.get("/login",function(req,res){
  res.render("login");
})
app.get("/checklogin",function(req,res){
  var name = req.query.username;
  var psd = req.query.password;

  db.find("test","users",{"username": name},function(err, result){
    if(result.list.length == 0){
      res.send("没有该用户");
      return;
    }
    var sjkpsd = result.list[0].password;
    if(hash.hash(psd) == sjkpsd){
      req.session.login = "1";
      req.session.username = result.list[0].username;
      // res.send("登录成功！你是"+result.list[0].username);
      res.redirect("/")
    }else{
      res.send("密码错误");
    }
  })
})

app.listen(3000)