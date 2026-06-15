const express = require("express");
const router = express.Router();

const sendServerError = function (res, err) {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
};

module.exports = (db) => {
  router.get("/", (req, res) => {
    const user = req.session.userId;
    if (!user) {
      return res.redirect("/login");
    }

    db.query(
      `SELECT messages.id, messages.text, properties.image_url, properties.name AS property_name, users.name
      FROM messages
      INNER JOIN properties ON properties.id = messages.property_id
      LEFT JOIN users ON users.id = messages.sender_id
      WHERE properties.owner_id = $1`,
      [user]
    )
      .then((data) => {
        const templateVars = { user: user, messages: data.rows };
        res.render("messages", templateVars);
      })
      .catch((err) => {
        sendServerError(res, err);
      });
  });

  return router;
};
