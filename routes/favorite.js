const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(
      `SELECT * FROM favorites
      JOIN properties on properties.id =  property_id`)
      .then((data) => {
        //console.log(data.rows);
        //console.log(req.cookies)
        const templateVars = { favorites: data.rows };
        //console.log(templateVars);
        res.render("favorite", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });

  });
   return router;
}
