// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
//app.set('views', __dirname + '/views');
const app = express();

const morgan = require("morgan");
const propertyRoutes = require("./routes/properties");
const loginRoutes = require("./routes/login");
const messageRoutes = require("./routes/messages");
const cookieParser = require("cookie-parser");

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect()
  .then(() => {
    console.log("Connection passed");
  })
  .catch((err) => {
    console.log("I am error", err);
  });

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));
app.use(cookieParser());

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);

app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
// const usersRoutes = require("./routes/users");
// const widgetsRoutes = require("./routes/widgets");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// app.use("/api/users", usersRoutes(db));
// app.use("/api/widgets", widgetsRoutes(db));

app.use("/properties", propertyRoutes(db));
//app.use("/properties", getProperty(db));
app.use("/login", loginRoutes(db));
app.use("/messages", messageRoutes(db));

// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

// LOGIN
app.post("/login", (req, res) => {
  res.cookie("userCookie", 1, { maxAge: 900000, httpOnly: true });
  res.redirect("/properties");
});

// LOGOUT
app.post("/logout", (req, res) => {
  res.clearCookie("userCookie");
  res.redirect("/");
});

// HOME PAGE
app.get("/", (req, res) => {
  let user = req.cookies.userCookie;
  const templateVars = { user: user };
  res.render("index", templateVars);
});

app.listen(PORT, () => {
  console.log(`BuySell app listening on port ${PORT}`);
});
