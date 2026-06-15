const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    let user = req.session.userId;
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
    let user = req.session.userId;
    if (!user) {
      return res.redirect("/login");
    }

    const templateVars = { user: user };
    res.render("addNewProperty", templateVars);
  });

  router.get("/:id", (req, res) => {
    let user = req.session.userId;
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
    let user = req.session.userId;
    if (!user) {
      return res.redirect("/login");
    }

    db.query(
      `INSERT INTO favorites (user_id, property_id)
        SELECT $1, $2
        WHERE NOT EXISTS (
          SELECT 1 FROM favorites WHERE user_id = $1 AND property_id = $2
        );`,
      [user, req.params.property_id]
    )
      .then(() => {
        res.redirect("/favourite");
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post("/:property_id", (req, res) => {
    let user = req.session.userId;
    if (!user) {
      return res.redirect("/login");
    }

    db.query(
      `INSERT INTO messages (sender_id, property_id, text) VALUES ($1, $2, $3);`,
      [user, req.params.property_id, req.body.message]
    )
      .then(() => {
        res.redirect(`/properties`);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post("/", (req, res) => {
    let user = req.session.userId;
    if (!user) {
      return res.redirect("/login");
    }

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
        user,
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
      .then(() => {
        res.redirect("/properties");
      })
      .catch((err) => {
        console.log(err);
      });
  });

  router.put("/", (req, res) => {
    let user = req.session.userId;
    console.log(req.body);

    if (!user) {
      return res.status(401).send("Login required");
    }

    db.query(
      `
      UPDATE properties
      SET isActive = false, image_url = 'http://trishbelford.com/wp-content/uploads/2017/03/sold_2010127164213_400.jpeg'
      WHERE properties.id=$1 AND owner_id=$2
    `,
      [req.body.id, user]
    )
      .then((result) => {
        if (result.rowCount === 0) {
          return res.status(404).send("Property not found");
        }

        res.send("property sold");
        console.log(result);
      })
      .catch((err) => console.log(err));
  });
  return router;
};
