const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    const user = req.cookies.userCookie;
    db.query(
      `SELECT messages.sender_id, messages.receiver_key, messages.property_id, messages.text, properties.image_url, properties.name AS property_name, users.*
      FROM messages
      JOIN properties ON properties.id = messages.property_id
      JOIN users ON users.id = messages.sender_id
      WHERE messages.receiver_key = $1`,
      [user]
    )
      .then((data) => {
        const templateVars = { user: user, messages: data.rows };
        res.render("messages", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  return router;
};
