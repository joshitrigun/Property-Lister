const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    let user = req.cookies.userCookie;
    //console.log(query);
    db.query(`SELECT * FROM properties where owner_id = 1;`)
      .then((data) => {
        console.log(data.rows);
        const templateVars = { user: user, myProperty: data.rows };
        res.render("myProperty", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  return router;
};
