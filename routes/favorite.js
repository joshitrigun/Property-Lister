const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(
      `SELECT * FROM favorites
      JOIN properties on properties.id =  property_id`)
      .then((data) => {
        const templateVars = { favorites: data.rows };
        res.render("favorite", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });

  });
   return router;
}
/*
 router.post("/:id", req,res) => {
  db.query(
    `INSERT INTO favorties (
      user_id) VALUES ($1);`,[req.params.id]
    )
 }
*/
