const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    let user = req.session.userId;
    //console.log(query);
    if (!user) {
      return res.redirect("/login");
    }

    db.query(`SELECT * FROM properties where owner_id = $1;`, [user])
      .then((data) => {
        const templateVars = { user: user, myProperty: data.rows };
        res.render("myProperty", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.delete("/:id/delete", (req, res) => {
    let user = req.session.userId;
    let property = req.params.id;
    //console.log(query);
    // console.log("property", property);
    // return res.json({ message: "Message success" });

    if (!user) {
      return res.status(401).json({ error: "Login required" });
    }

    db.query(`DELETE FROM properties where id = $1 AND owner_id = $2;`, [property, user])
      .then((data) => {
        if (data.rowCount === 0) {
          return res.status(404).json({ error: "Property not found" });
        }

        res.json({ message: "Property deleted" });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  return router;
};
