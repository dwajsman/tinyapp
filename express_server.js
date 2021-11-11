const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 8080; // default port 8080


app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


app.get("/", (req, res) => {
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// app.get("/hello", (req, res) => {
//   res.send("<html><body>Hello <b>World</b></body></html>\n");
// });

app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    username: req.cookies["username"],
  };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  let key = generateRandomString()
  urlDatabase[key] = req.body["longURL"];
  //res.send("Ok");         // Respond with 'Ok' (we will replace this)
  res.redirect('/urls/' + key);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  let key = req.params.shortURL;
  delete urlDatabase[key];

  res.redirect('/urls');
});


app.get("/urls/:shortURL", (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: req.params.longURL
  };
  res.render("urls_show", templateVars);

});

app.post("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.newUrl;
  res.redirect('/urls');
});




app.get("/u/:shortURL", (req, res) => {
  let key = req.params.shortURL;
  let longURL = urlDatabase[key];
  if (!urlDatabase[key]) {
    return res.redirect('/');
  }
  res.redirect(longURL);

});



let generateRandomString = function() {
  let random_string = '';
  let random_ascii;
  for (let i = 0; i < 6; i++) {
    random_ascii = Math.floor((Math.random() * 25) + 97);
    random_string += String.fromCharCode(random_ascii);
  }
  return random_string;
};

// cookie
app.post("/login", (req, res) => {
  const { username } = req.body;

  res.cookie("username", username);
  res.cookie("isAuthenticated", true);

  res.redirect('/urls');
});




app.post("/logout", (req, res) => {
  const { username } = req.body;

  res.clearCookie('username', username);
  res.clearCookie('isAuthenticated', null);

  res.redirect('/urls');
});


