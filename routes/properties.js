const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM properties;`)
      .then((data) => {
        console.log(data.rows);
        const templateVars = { properties: data.rows };
        console.log(templateVars);
        res.render("properties", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  return router;
};
