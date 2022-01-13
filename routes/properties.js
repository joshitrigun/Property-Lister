const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    let user = req.cookies.userCookie;
    let queryString = `SELECT * FROM properties`;
    let tokenPrice;
    if (req.query) {
      if (req.query.price) {
        tokenPrice = Number(req.query.price);
        queryString += ` WHERE cost >= $1 `;
      }
    }
    db.query(queryString, tokenPrice ? [tokenPrice] : [])
      .then((data) => {
        const templateVars = { user: user, properties: data.rows };
        res.render("properties", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.get("/new", (req, res) => {
    let user = req.cookies.userCookie;
    const templateVars = { user: user };
    res.render("addNewProperty", templateVars);
  });

  router.get("/:id", (req, res) => {
    let user = req.cookies.userCookie;
    db.query(`SELECT * FROM properties where id = $1;`, [req.params.id])
      .then((data) => {
        // console.log("check", data.rows);
        const templateVars = { user: user, property: data.rows[0] };
        res.render("property", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post("/favourites/:property_id", (req, res) => {
    let user = req.cookies.userCookie;
    console.log(req);
    db.query(
      `INSERT INTO favorites (
        user_id,
        property_id) VALUES ($1, $2);`,
      [user, req.params.property_id]
    )
      .then((data) => {
        res.redirect("/favourite");
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post("/:property_id", (req, res) => {
    let user = req.cookies.userCookie;
    console.log(req);
    db.query(
      `INSERT INTO messages (sender_id, property_id, text) VALUES ($1, $2, $3);`,
      [user, req.params.property_id, req.body.message]
    );
  });

  router.post("/", (req, res) => {
    db.query(
      `INSERT INTO properties (
          owner_id,
          name,
          title,
          description,
          cost,
          image_url,
          number_of_bedrooms,
          number_of_bathrooms,
          country,
          province,
          city,
          postal_code,
          street,
          isActive)
          VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
          RETURNING *;
`,
      [
        1,
        req.body.name,
        req.body.title,
        req.body.description,
        Number(req.body.cost),
        req.body.imageUrl,
        Number(req.body.bedrooms),
        Number(req.body.bathrooms),
        req.body.country,
        req.body.province,
        req.body.city,
        req.body.postalCode,
        req.body.street,
        req.body.isActive,
      ]
    )
      .then((results) => {
        res.redirect("/properties");
      })
      .catch((err) => {
        console.log(err);
      });
  });

  return router;
};
