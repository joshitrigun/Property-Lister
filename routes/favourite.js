const express = require("express");
const router = express.Router();

const parsePositiveInteger = function (value, fallback, max) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) {
    return fallback;
  }

  return max ? Math.min(parsed, max) : parsed;
};

const sendServerError = function (res, err) {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
};

module.exports = (db) => {
  router.get("/", (req, res) => {
    let user = req.session.userId;
    const limit = parsePositiveInteger(req.query.limit, 24, 48);
    const page = parsePositiveInteger(req.query.page, 1);
    const offset = (page - 1) * limit;
    if (!user) {
      return res.redirect("/login");
    }

    db.query(
      `SELECT properties.id, properties.name, properties.description, properties.city, properties.cost,
        properties.image_url, properties.number_of_bathrooms, properties.number_of_bedrooms
      FROM favorites
      JOIN properties on properties.id =  property_id
      WHERE favorites.user_id = $1
      ORDER BY favorites.id DESC
      LIMIT $2 OFFSET $3`,
      [user, limit, offset]
    )
      .then((data) => {
        const templateVars = { user: user, favorites: data.rows };
        res.render("favourite", templateVars);
      })
      .catch((err) => {
        sendServerError(res, err);
      });
  });

  return router;
};
