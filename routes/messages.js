const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    const user = req.cookies.userCookie;
    db.query(
      `SELECT messages.id, messages.text, properties.image_url, properties.name AS property_name, users.name
      FROM messages
      INNER JOIN properties ON properties.id = messages.property_id
      LEFT JOIN users ON users.id = messages.sender_id
      WHERE properties.owner_id = $1`,
      [user]
    )
      .then((data) => {
        console.log(data.rows);
        const templateVars = { user: user, messages: data.rows };
        res.render("messages", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  return router;
};
