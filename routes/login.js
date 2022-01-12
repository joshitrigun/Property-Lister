const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    let user = req.cookies.userCookie;
    const templateVars = { user: user };
    res.render("login", templateVars);
  });
  /*
  router.post("/login", (req, res) => {
    console.log('trylogin')
    var randomNumber=Math.random().toString();
    randomNumber=randomNumber.substring(2,randomNumber.length);
    res.cookie('userCookie',randomNumber, { maxAge: 900000, httpOnly: true });
    res.render("properties");

  });
*/
  return router;
};
