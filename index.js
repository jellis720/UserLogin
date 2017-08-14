const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const handlebarsExpress = require("express-handlebars");
const session = require("express-session");
const validator = require("express-validator");
const loginName = require("./data/loginNames.js");


app.engine('handlebars', handlebarsExpress());
app.set('views', './view');
app.set('view engine', 'handlebars');

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.get('/', function(req, res) {
  res.render('home', {
  });
});

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}))

app.use(validator());


app.get("/", function(req, res){
  if (!req.session.user){
    res.redirect("login");
} else {
  res.render("home",{
  user: req.session.user
})
}
})

app.get("/login", function(req, res){
  res.render("login")
})

app.post("/login", function(req, res){
  let player = req.session.body


req.checkBody("username", "username required").notEmpty();
req.checkBody("password", "password required").notEmpty();

let errors = req.validationErrors();

if (errors){
  res.render("login",{
    errors: errors
  });
} else{
  let users = loginName.filter(function(userCheck){
    return userCheck.username === req.body.username;
  });
  if (users === undefined || users.length === 0){
    res.send("No One Found");
  }
}



let millenialUser = loginName[0];

if (millenialUser.password == req.body.password){
  req.session.user = millenialUser.username;
  res.redirect("/");
}else{
  res.send("No Password");
}
});
app.listen(3000);
