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
  square_feet,
  property_type,
  neighbourhood,
  city,
  latitude,
  longitude,
  isActive,
  isFeatured
`;

const VALID_PROPERTY_TYPES = ["House", "Condo", "Townhouse", "Apartment", "Land"];
const SORT_MAP = {
  price_asc: "cost ASC, id DESC",
  price_desc: "cost DESC, id DESC",
  newest: "id DESC",
  featured: "isFeatured DESC, id DESC",
};

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
  return { limit, offset: (page - 1) * limit, page };
};

module.exports = (db) => {
  router.get("/", (req, res) => {
    const user = req.session.userId;
    const { limit, offset, page } = getPagination(req.query);

    const queryParams = [];
    const conditions = [];

    // --- price range ---
    if (req.query.min_price) {
      const v = Number(req.query.min_price);
      if (!Number.isFinite(v) || v < 0) {
        return res.status(400).json({ error: "Invalid min_price" });
      }
      queryParams.push(v);
      conditions.push(`cost >= $${queryParams.length}`);
    }
    if (req.query.max_price) {
      const v = Number(req.query.max_price);
      if (!Number.isFinite(v) || v < 0) {
        return res.status(400).json({ error: "Invalid max_price" });
      }
      queryParams.push(v);
      conditions.push(`cost <= $${queryParams.length}`);
    }

    // --- beds / baths (min) ---
    if (req.query.min_beds) {
      const v = parsePositiveInteger(req.query.min_beds, 0);
      if (v > 0) {
        queryParams.push(v);
        conditions.push(`number_of_bedrooms >= $${queryParams.length}`);
      }
    }
    if (req.query.min_baths) {
      const v = parsePositiveInteger(req.query.min_baths, 0);
      if (v > 0) {
        queryParams.push(v);
        conditions.push(`number_of_bathrooms >= $${queryParams.length}`);
      }
    }

    // --- property type ---
    if (req.query.property_type) {
      if (!VALID_PROPERTY_TYPES.includes(req.query.property_type)) {
        return res.status(400).json({ error: "Invalid property_type" });
      }
      queryParams.push(req.query.property_type);
      conditions.push(`property_type = $${queryParams.length}`);
    }

    // --- city / neighbourhood (partial match) ---
    if (req.query.city && req.query.city.trim()) {
      queryParams.push(`%${req.query.city.trim()}%`);
      conditions.push(`city ILIKE $${queryParams.length}`);
    }
    if (req.query.neighbourhood && req.query.neighbourhood.trim()) {
      queryParams.push(`%${req.query.neighbourhood.trim()}%`);
      conditions.push(`neighbourhood ILIKE $${queryParams.length}`);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const orderBy = SORT_MAP[req.query.sort] || "id DESC";

    // Push limit/offset last so their positions are predictable.
    queryParams.push(limit, offset);
    const limitIdx = queryParams.length - 1;
    const offsetIdx = queryParams.length;

    const queryString = `
      SELECT ${PROPERTY_CARD_COLUMNS}, COUNT(*) OVER() AS total_count
      FROM properties
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT $${limitIdx} OFFSET $${offsetIdx}`;

    // Stats queries share the same WHERE params (no limit/offset)
    const statsParams = queryParams.slice(0, queryParams.length - 2);
    const statsQuery = `
      SELECT
        PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY cost) AS median_price,
        AVG(cost::numeric / NULLIF(square_feet, 0))        AS avg_price_per_sqft
      FROM properties
      ${whereClause}`;
    const typeQuery = `
      SELECT property_type, COUNT(*) AS cnt
      FROM properties
      ${whereClause}
      GROUP BY property_type
      ORDER BY cnt DESC`;

    Promise.all([
      db.query(queryString, queryParams),
      db.query(statsQuery, statsParams),
      db.query(typeQuery, statsParams),
    ])
      .then(([data, statsData, typeData]) => {
        const totalCount = data.rows.length > 0 ? parseInt(data.rows[0].total_count, 10) : 0;
        const totalPages = Math.ceil(totalCount / limit) || 1;
        const mapPins = data.rows
          .filter((r) => r.latitude && r.longitude)
          .map((r) => ({
            id: r.id,
            name: r.name,
            cost: r.cost,
            lat: parseFloat(r.latitude),
            lng: parseFloat(r.longitude),
          }));
        const statsRow = statsData.rows[0] || {};
        const marketStats = {
          medianPrice: statsRow.median_price ? Math.round(statsRow.median_price) : null,
          avgPricePerSqft: statsRow.avg_price_per_sqft ? Math.round(statsRow.avg_price_per_sqft) : null,
          typeCounts: typeData.rows,
        };
        // Build the query string for saved-search (strip page)
        const currentQueryString = Object.entries(req.query)
          .filter(([k, v]) => k !== "page" && v)
          .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
          .join("&");
        const templateVars = {
          user,
          properties: data.rows,
          query: req.query,
          page,
          totalPages,
          totalCount,
          validPropertyTypes: VALID_PROPERTY_TYPES,
          mapPins,
          marketStats,
          currentQueryString,
        };
        res.render("properties", templateVars);
      })
      .catch((err) => sendServerError(res, err));
  });

  router.get("/new", (req, res) => {
    const user = req.session.userId;
    if (!user) {
      return res.redirect("/login");
    }

    res.render("addNewProperty", { user, validPropertyTypes: VALID_PROPERTY_TYPES });
  });

  router.get("/:id", (req, res) => {
    const user = req.session.userId;
    const propertyId = parsePositiveInteger(req.params.id);
    if (!propertyId) {
      return res.status(400).json({ error: "Invalid property id" });
    }

    Promise.all([
      db.query(`SELECT * FROM properties WHERE id = $1;`, [propertyId]),
      db.query(
        `SELECT image_url FROM property_images
         WHERE property_id = $1
         ORDER BY sort_order ASC;`,
        [propertyId]
      ),
    ])
      .then(([propResult, imgResult]) => {
        if (!propResult.rows[0]) {
          return res.status(404).send("Property not found");
        }
        const property = propResult.rows[0];
        const images = imgResult.rows.map((r) => r.image_url);
        // Similar listings: same city + type, exclude self, max 3
        return db.query(
          `SELECT ${PROPERTY_CARD_COLUMNS}
           FROM properties
           WHERE id != $1 AND city = $2 AND property_type = $3 AND isActive = true
           ORDER BY isFeatured DESC, id DESC
           LIMIT 3;`,
          [propertyId, property.city, property.property_type]
        ).then((simResult) => {
          res.render("property", { user, property, images, similar: simResult.rows });
        });
      })
      .catch((err) => sendServerError(res, err));
  });

  router.post("/favourites/:property_id", (req, res) => {
    const user = req.session.userId;
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
      .then(() => res.redirect("/favourite"))
      .catch((err) => sendServerError(res, err));
  });

  router.post("/:property_id", (req, res) => {
    const user = req.session.userId;
    if (!user) {
      return res.redirect("/login");
    }

    const propertyId = parsePositiveInteger(req.params.property_id);
    if (!propertyId) {
      return res.status(400).json({ error: "Invalid property id" });
    }

    const message = typeof req.body.message === "string" ? req.body.message.slice(0, 2000) : "";
    if (!message.trim()) {
      return res.status(400).send("Message cannot be empty");
    }

    db.query(
      `INSERT INTO messages (sender_id, property_id, text) VALUES ($1, $2, $3);`,
      [user, propertyId, message]
    )
      .then(() => res.redirect("/properties"))
      .catch((err) => sendServerError(res, err));
  });

  router.post("/", (req, res) => {
    const user = req.session.userId;
    if (!user) {
      return res.redirect("/login");
    }

    const propertyType = req.body.property_type;
    if (!VALID_PROPERTY_TYPES.includes(propertyType)) {
      return res.status(400).send("Invalid property type");
    }

    db.query(
      `INSERT INTO properties (
          owner_id, name, title, description, cost, image_url,
          number_of_bedrooms, number_of_bathrooms, square_feet,
          property_type, neighbourhood,
          country, province, city, postal_code, street, isActive)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, true)
         RETURNING id;`,
      [
        user,
        req.body.name,
        req.body.title,
        req.body.description,
        Number(req.body.cost),
        req.body.imageUrl,
        Number(req.body.bedrooms),
        Number(req.body.bathrooms),
        req.body.square_feet ? Number(req.body.square_feet) : null,
        propertyType,
        req.body.neighbourhood || null,
        req.body.country,
        req.body.province,
        req.body.city,
        req.body.postalCode,
        req.body.street,
      ]
    )
      .then((data) => {
        const newId = data.rows[0].id;
        // Insert any additional gallery images
        const extras = Array.isArray(req.body.extraImageUrl)
          ? req.body.extraImageUrl
          : req.body.extraImageUrl
          ? [req.body.extraImageUrl]
          : [];
        const validExtras = extras.filter((u) => typeof u === "string" && u.trim());
        if (validExtras.length === 0) {
          return res.redirect(`/properties/${newId}`);
        }
        const values = validExtras.map((u, i) => `($1, $${i + 2}, ${i + 1})`).join(", ");
        return db
          .query(
            `INSERT INTO property_images (property_id, image_url, sort_order) VALUES ${values}`,
            [newId, ...validExtras]
          )
          .then(() => res.redirect(`/properties/${newId}`));
      })
      .catch((err) => sendServerError(res, err));
  });

  router.put("/", (req, res) => {
    const user = req.session.userId;
    if (!user) {
      return res.status(401).send("Login required");
    }

    const propertyId = parsePositiveInteger(req.body.id);
    if (!propertyId) {
      return res.status(400).send("Invalid property id");
    }

    db.query(
      `UPDATE properties
       SET isActive = false
       WHERE id = $1 AND owner_id = $2`,
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
