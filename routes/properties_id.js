/*
const express = require("express");
const router = express.Router();

const getProperty = (db) => {
  router.get("/", (req, res) => {
    console.log('inside route',req.params)
    db.query(`SELECT * FROM properties where id = $1;`, [req.params.id])
      .then((data) => {
        console.log('check', data.rows);
        const templateVars = { property: data.rows[0] };
        res.render("properties_id", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      })
  });
  return router;
};
module.exports = { getProperty };
*/
