// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const express = require("express");
//app.set('views', __dirname + '/views');
const app = express();
const crypto = require("crypto");

if (process.env.NODE_ENV === "production" && !process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET must be set in production");
}

const morgan = require("morgan");
const helmet = require("helmet");
const propertyRoutes = require("./routes/properties");
const loginRoutes = require("./routes/login");
const favouriteRoute = require("./routes/favourite");
const messageRoutes = require("./routes/messages");
const myProperty = require("./routes/myProperty");
const cookieSession = require("cookie-session");

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.query("SELECT 1")
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
app.use(helmet({
  contentSecurityPolicy: false,
}));
app.set("trust proxy", 1);
app.use(cookieSession({
  name: "session",
  keys: [process.env.SESSION_SECRET || "development-session-secret"],
  maxAge: 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
}));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use((req, res, next) => {
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(32).toString("hex");
  }

  res.locals.csrfToken = req.session.csrfToken;

  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    const requestToken = req.body._csrf || req.get("x-csrf-token");
    if (requestToken !== req.session.csrfToken) {
      return res.status(403).send("Invalid CSRF token");
    }
  }

  next();
});

app.use(express.static("public", {
  maxAge: process.env.NODE_ENV === "production" ? "7d" : 0,
  etag: true,
}));

app.use("/properties", propertyRoutes(db));
//app.use("/properties", getProperty(db));
app.use("/login", loginRoutes(db));
app.use("/messages", messageRoutes(db));
app.use("/favourite", favouriteRoute(db));
app.use("/myProperty", myProperty(db));
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

// LOGIN
app.post("/login", (req, res) => {
  req.session.userId = 1;
  res.redirect("/properties");
});

// LOGOUT
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/");
});

// HOME PAGE
app.get("/", (req, res) => {
  let user = req.session.userId;
  const templateVars = { user: user };
  res.render("index", templateVars);
});

app.listen(PORT, () => {
  console.log(`BuySell app listening on port ${PORT}`);
});
