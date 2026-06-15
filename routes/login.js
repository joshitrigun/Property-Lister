const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    let user = req.session.userId;
    const templateVars = { user: user };
    res.render("login", templateVars);
  });
  return router;
};
