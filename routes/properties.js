const express = require("express");
const router = express.Router();

const PROPERTY_CARD_COLUMNS = `
  id,
  name,
  description,
  cost,
  image_url,
  number_of_bedrooms,
  number_of_bathrooms,
  isFeatured
`;

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

const getPagination = function (query) {
  const limit = parsePositiveInteger(query.limit, 24, 48);
  const page = parsePositiveInteger(query.page, 1);
  return { limit, offset: (page - 1) * limit };
};

module.exports = (db) => {
  router.get("/", (req, res) => {
    let user = req.session.userId;
    const { limit, offset } = getPagination(req.query);
    let queryString = `SELECT ${PROPERTY_CARD_COLUMNS} FROM properties`;
    const queryParams = [];
    if (req.query) {
      if (req.query.price) {
        const price = Number(req.query.price);
        if (!Number.isInteger(price) || price < 0) {
          return res.status(400).json({ error: "Invalid price filter" });
        }

        queryParams.push(price);
        queryString += ` WHERE cost >= $${queryParams.length} `;
      }
    }
    queryParams.push(limit, offset);
    queryString += ` ORDER BY id DESC LIMIT $${queryParams.length - 1} OFFSET $${queryParams.length}`;

    db.query(queryString, queryParams)
      .then((data) => {
        const templateVars = { user: user, properties: data.rows };
        res.render("properties", templateVars);
      })
      .catch((err) => {
        sendServerError(res, err);
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
    const propertyId = parsePositiveInteger(req.params.id);
    if (!propertyId) {
      return res.status(400).json({ error: "Invalid property id" });
    }

    db.query(`SELECT * FROM properties where id = $1;`, [propertyId])
      .then((data) => {
        // console.log("check", data.rows);
        const templateVars = { user: user, property: data.rows[0] };
        res.render("property", templateVars);
      })
      .catch((err) => {
        sendServerError(res, err);
      });
  });

  router.post("/favourites/:property_id", (req, res) => {
    let user = req.session.userId;
    if (!user) {
      return res.redirect("/login");
    }

    const propertyId = parsePositiveInteger(req.params.property_id);
    if (!propertyId) {
      return res.status(400).json({ error: "Invalid property id" });
    }

    db.query(
      `INSERT INTO favorites (user_id, property_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, property_id) DO NOTHING;`,
      [user, propertyId]
    )
      .then(() => {
        res.redirect("/favourite");
      })
      .catch((err) => {
        sendServerError(res, err);
      });
  });

  router.post("/:property_id", (req, res) => {
    let user = req.session.userId;
    if (!user) {
      return res.redirect("/login");
    }

    const propertyId = parsePositiveInteger(req.params.property_id);
    if (!propertyId) {
      return res.status(400).json({ error: "Invalid property id" });
    }

    db.query(
      `INSERT INTO messages (sender_id, property_id, text) VALUES ($1, $2, $3);`,
      [user, propertyId, req.body.message]
    )
      .then(() => {
        res.redirect(`/properties`);
      })
      .catch((err) => {
        sendServerError(res, err);
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
        sendServerError(res, err);
      });
  });

  router.put("/", (req, res) => {
    let user = req.session.userId;

    if (!user) {
      return res.status(401).send("Login required");
    }

    const propertyId = parsePositiveInteger(req.body.id);
    if (!propertyId) {
      return res.status(400).send("Invalid property id");
    }

    db.query(
      `
      UPDATE properties
      SET isActive = false, image_url = 'http://trishbelford.com/wp-content/uploads/2017/03/sold_2010127164213_400.jpeg'
      WHERE properties.id=$1 AND owner_id=$2
    `,
      [propertyId, user]
    )
      .then((result) => {
        if (result.rowCount === 0) {
          return res.status(404).send("Property not found");
        }

        res.send("property sold");
      })
      .catch((err) => sendServerError(res, err));
  });
  return router;
};
