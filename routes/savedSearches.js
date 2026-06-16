const express = require("express");
const router = express.Router();

const sendServerError = (res, err) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
};

module.exports = (db) => {
  // List all saved searches for the logged-in user
  router.get("/", (req, res) => {
    const user = req.session.userId;
    if (!user) {
      return res.redirect("/login");
    }

    db.query(
      `SELECT id, name, query_params, created_at
       FROM saved_searches
       WHERE user_id = $1
       ORDER BY created_at DESC;`,
      [user]
    )
      .then((data) => {
        res.render("savedSearches", { user, searches: data.rows });
      })
      .catch((err) => sendServerError(res, err));
  });

  // Save a new search
  router.post("/", (req, res) => {
    const user = req.session.userId;
    if (!user) {
      return res.redirect("/login");
    }

    const name = typeof req.body.name === "string" ? req.body.name.trim().slice(0, 100) : "";
    const queryParams = typeof req.body.query_params === "string" ? req.body.query_params.slice(0, 2000) : "";

    if (!name || !queryParams) {
      return res.redirect("/properties");
    }

    db.query(
      `INSERT INTO saved_searches (user_id, name, query_params) VALUES ($1, $2, $3);`,
      [user, name, queryParams]
    )
      .then(() => res.redirect("/saved-searches"))
      .catch((err) => sendServerError(res, err));
  });

  // Delete a saved search
  router.post("/:id/delete", (req, res) => {
    const user = req.session.userId;
    if (!user) {
      return res.redirect("/login");
    }

    const id = parseInt(req.params.id, 10);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: "Invalid id" });
    }

    // Only delete searches owned by this user
    db.query(
      `DELETE FROM saved_searches WHERE id = $1 AND user_id = $2;`,
      [id, user]
    )
      .then(() => res.redirect("/saved-searches"))
      .catch((err) => sendServerError(res, err));
  });

  return router;
};
