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
    //console.log(query);
    if (!user) {
      return res.redirect("/login");
    }

    db.query(
      `SELECT id, name, description, cost, image_url, number_of_bedrooms, number_of_bathrooms
      FROM properties
      WHERE owner_id = $1
      ORDER BY id DESC
      LIMIT $2 OFFSET $3;`,
      [user, limit, offset]
    )
      .then((data) => {
        const templateVars = { user: user, myProperty: data.rows };
        res.render("myProperty", templateVars);
      })
      .catch((err) => {
        sendServerError(res, err);
      });
  });
  router.delete("/:id/delete", (req, res) => {
    let user = req.session.userId;
    let property = parsePositiveInteger(req.params.id);
    //console.log(query);
    // console.log("property", property);
    // return res.json({ message: "Message success" });

    if (!user) {
      return res.status(401).json({ error: "Login required" });
    }

    if (!property) {
      return res.status(400).json({ error: "Invalid property id" });
    }

    db.query(`DELETE FROM properties where id = $1 AND owner_id = $2;`, [property, user])
      .then((data) => {
        if (data.rowCount === 0) {
          return res.status(404).json({ error: "Property not found" });
        }

        res.json({ message: "Property deleted" });
      })
      .catch((err) => {
        sendServerError(res, err);
      });
  });
  return router;
};
