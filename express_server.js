const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 8080; // default port 8080


app.use(cookieParser());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(express.static("public")); // Static files (css / images)
// app.use(app.router);



// ██████╗ ██████╗
// ██╔══██╗██╔══██╗
// ██║  ██║██████╔╝
// ██║  ██║██╔══██╗
// ██████╔╝██████╔╝
// ╚═════╝ ╚═════╝
                

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  "a2kjc3": {
    id: "a2kjc3",
    email: "bill@microsoft.com",
    password: "vaccinechip"
  },
  "9dds3e": {
    id: "9dds3e",
    email: "steve@apple.com",
    password: "windowssuks"
  }
};
let user;
// find user by email
function userByEmail(users, email) {
  for (const user_id in users) {
    if (Object.hasOwnProperty.call(users, user_id)) {
      const user = users[user_id];
      if (email === user["email"]) {
        return user_id;
      };
    };
  };
};




// ██╗███╗   ██╗██████╗ ███████╗██╗  ██╗
// ██║████╗  ██║██╔══██╗██╔════╝╚██╗██╔╝
// ██║██╔██╗ ██║██║  ██║█████╗   ╚███╔╝ 
// ██║██║╚██╗██║██║  ██║██╔══╝   ██╔██╗ 
// ██║██║ ╚████║██████╔╝███████╗██╔╝ ██╗
// ╚═╝╚═╝  ╚═══╝╚═════╝ ╚══════╝╚═╝  ╚═╝
                                     


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
    user,
  };
  res.render("urls_index", templateVars);
});


// ██████╗ ███████╗ ██████╗ ██╗███████╗████████╗███████╗██████╗
// ██╔══██╗██╔════╝██╔════╝ ██║██╔════╝╚══██╔══╝██╔════╝██╔══██╗
// ██████╔╝█████╗  ██║  ███╗██║███████╗   ██║   █████╗  ██████╔╝
// ██╔══██╗██╔══╝  ██║   ██║██║╚════██║   ██║   ██╔══╝  ██╔══██╗
// ██║  ██║███████╗╚██████╔╝██║███████║   ██║   ███████╗██║  ██║
// ╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝╚══════╝   ╚═╝   ╚══════╝╚═╝  ╚═╝
                                                             
app.get("/register", (req, res) => {
  const templateVars = {
    email: users,
    password: users,
    urls: urlDatabase,
    user,
  };
  res.render("registration", templateVars);
});

app.post("/urls", (req, res) => {
  let key = generateRandomString();
  urlDatabase[key] = req.body["longURL"];

  res.redirect('/urls/' + key);
});

app.post("/register", (req, res) => {
  console.log(users);
  
  let key = generateRandomString();

  users[key] = {
    id: key,
    email: req.body["email"],
    password: req.body["password"],
  };

  const { email } = req.body;

  let user_id = userByEmail(email);

  res.cookie("user", user_id);
  console.log(user_id, users);

  //res.redirect('/urls');

  
});






// ██╗   ██╗██████╗ ██╗     ███████╗
// ██║   ██║██╔══██╗██║     ██╔════╝
// ██║   ██║██████╔╝██║     ███████╗
// ██║   ██║██╔══██╗██║     ╚════██║
// ╚██████╔╝██║  ██║███████╗███████║
//  ╚═════╝ ╚═╝  ╚═╝╚══════╝╚══════╝
                                 




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



//  ██████╗ ██████╗  ██████╗ ██╗  ██╗██╗███████╗
// ██╔════╝██╔═══██╗██╔═══██╗██║ ██╔╝██║██╔════╝
// ██║     ██║   ██║██║   ██║█████╔╝ ██║█████╗
// ██║     ██║   ██║██║   ██║██╔═██╗ ██║██╔══╝
// ╚██████╗╚██████╔╝╚██████╔╝██║  ██╗██║███████╗
//  ╚═════╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝╚══════╝
// + LOGIN AND LOGOUT
app.post("/login", (req, res) => {
  const { email } = req.body;
  console.log(email);
  // const user_id = userByEmail(users, email);
  // const user = users[user_id];
  // if (password === user[password]) {
    res.cookie("user", email);

    res.redirect('/urls');
  // } else {
  //   res.redirect('/register');
  // }

  // res.cookie("isAuthenticated", true);

  
});




app.post("/logout", (req, res) => {
  const { username } = req.body;

  res.clearCookie('username', username);
  res.clearCookie('isAuthenticated', null);

  res.redirect('/urls');
});




