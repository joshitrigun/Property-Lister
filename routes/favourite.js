const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    let user = req.session.userId;
    if (!user) {
      return res.redirect("/login");
    }

    db.query(
      `SELECT * FROM favorites
      JOIN properties on properties.id =  property_id
      WHERE favorites.user_id = $1
      ORDER BY favorites.id DESC`,
      [user]
    )
      .then((data) => {
        const templateVars = { user: user, favorites: data.rows };
        res.render("favourite", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  return router;
};
