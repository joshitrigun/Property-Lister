const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    let user = req.cookies.userCookie;
    db.query(
      `SELECT users.name AS name, properties.name AS property_name, properties.image_url AS image, messages.text
       FROM messages
       JOIN users ON users.id = sender_id
       JOIN properties ON properties.id = property_id
       WHERE users.id = $1;`,
      [req.cookies.userCookie]
    )
      .then((data) => {
        console.log("check", data.rows);
        const templateVars = { user: user, messages: data.rows };
        res.render("messages", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  return router;
};
