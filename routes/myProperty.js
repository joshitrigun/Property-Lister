const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    let user = req.cookies.userCookie;
    //console.log(query);
    db.query(`SELECT * FROM properties where owner_id = 1;`)
      .then((data) => {
        const templateVars = { user: user, myProperty: data.rows };
        res.render("myProperty", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.delete("/:id/delete", (req, res) => {
    // let user = req.cookies.userCookie;
    let property = req.params.id;
    //console.log(query);
    // console.log("property", property);
    // return res.json({ message: "Message success" });

    db.query(`DELETE FROM properties where id = ${property};`)
      .then((data) => {
        const templateVars = { myProperty: data.rows };
        res.json({ message: "Property deleted" });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  return router;
};
