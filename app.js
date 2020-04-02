var express = require("express");
var app = express();
var session = require("express-session");
var bodyParser = require('body-parser'); // post方法

db = require("./model/main.js");
hash = require("./model/hash.js");

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  cookie: {maxAge: 60000},
  saveUninitialized: true,
}));

// post json解析
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

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
app.post("/add",function(req,res){
  db.insertOne("test","users",{
    "username": req.body.username,
    "password": hash(req.body.password)
  },function(err,result){
    if(err){
      res.json({success: false,msg: err});
      return;
    }
    res.json({success: true});
  })
})

// 登录
app.get("/login",function(req,res){
  res.render("login");
})
app.post("/checklogin",function(req,res){
  var name = req.body.username;
  var psd = req.body.password;

  db.find("test","users",{"username": name},function(err, result){
    if(result.list.length == 0){
      res.json({success: false,msg: "没有该用户"});
      return;
    }
    var sjkpsd = result.list[0].password;
    if(hash(psd) == sjkpsd){
      req.session.login = "1";
      req.session.username = result.list[0].username;
      res.json({success: true});
      // res.redirect("/")
    }else{
      res.json({success: false,msg: "密码错误"});
    }
  })
})

app.listen(3000)