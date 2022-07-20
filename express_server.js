const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

const generateRandonString = () => {
  return Math.random().toString(36).replace("0.", "").substring(0, 6);
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.send(urlDatabase);
});

app.get("/hello", (req, res) => {
  const templateVars = { greeting: "Hello Worlddd!" };
  res.render("hello_world", templateVars);
});

app.get("/urls", (req, res) => {
  const templateVars = { username: req.cookies["username"], urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = { username: req.cookies["username"] };
  res.render("urls_new", templateVars);
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandonString();
  console.log(req.body, shortURL);
  const templateVars = {
    id: shortURL,
    longURL: req.body.longURL,
  };
  res.render("urls_show", templateVars);
});

app.get("/urls/:id", (req, res) => {
  // console.log(req.params);
  // console.log(res);
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
  };
  res.render("urls_show", templateVars);
});

//delete
app.post("/urls/:id/delete", (req, res) => {
  let removeID = req.params.id;

  console.log(removeID);
  delete urlDatabase[removeID];
  res.redirect("/urls");
});

//edit
app.post("/urls/:id/", (req, res) => {
  console.log(req.params, req.body);
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect("/urls/");
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

//cookie
app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on prot ${PORT}`);
});
