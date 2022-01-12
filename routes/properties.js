const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
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
        console.log(data.rows);
        const templateVars = { properties: data.rows };
        res.render("properties", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  router.get("/new", (req, res) => {
    res.render("addNewProperty");
  });

  router.get("/:id", (req, res) => {
    // console.log("inside route", req.params);
    db.query(`SELECT * FROM properties where id = $1;`, [req.params.id])
      .then((data) => {
        // console.log("check", data.rows);
        const templateVars = { property: data.rows[0] };
        res.render("property", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
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
      .then((res) => {
        console.log(res.rows);
        res.send(res.rows[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  return router;
};
