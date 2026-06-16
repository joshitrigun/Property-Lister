const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();

const BCRYPT_COST = 10;
const MIN_PASSWORD_LENGTH = 8;

const normalizeEmail = function (value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
};

module.exports = (db) => {
  // GET /login - show the login form
  router.get("/", (req, res) => {
    if (req.session.userId) {
      return res.redirect("/properties");
    }

    res.render("login", { user: null, error: null, email: "" });
  });

  // POST /login - authenticate an existing user
  router.post("/", (req, res) => {
    const email = normalizeEmail(req.body.email);
    const password = typeof req.body.password === "string" ? req.body.password : "";

    if (!email || !password) {
      return res
        .status(400)
        .render("login", { user: null, error: "Email and password are required.", email });
    }

    db.query(`SELECT id, password FROM users WHERE email = $1;`, [email])
      .then((data) => {
        const account = data.rows[0];
        // Always run a comparison to avoid leaking whether the email exists.
        const hash = account ? account.password : "";
        return bcrypt.compare(password, hash).then((matches) => {
          if (!account || !matches) {
            return res.status(401).render("login", {
              user: null,
              error: "Invalid email or password.",
              email,
            });
          }

          req.session.userId = account.id;
          res.redirect("/properties");
        });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).render("login", {
          user: null,
          error: "Something went wrong. Please try again.",
          email,
        });
      });
  });

  // GET /login/register - show the sign-up form
  router.get("/register", (req, res) => {
    if (req.session.userId) {
      return res.redirect("/properties");
    }

    res.render("register", { user: null, error: null, values: {} });
  });

  // POST /login/register - create a new account
  router.post("/register", (req, res) => {
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    const email = normalizeEmail(req.body.email);
    const phone = typeof req.body.phone === "string" ? req.body.phone.trim() : "";
    const password = typeof req.body.password === "string" ? req.body.password : "";

    const values = { name, email, phone };

    if (!name || !email || !phone || !password) {
      return res.status(400).render("register", {
        user: null,
        error: "All fields are required.",
        values,
      });
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      return res.status(400).render("register", {
        user: null,
        error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
        values,
      });
    }

    bcrypt
      .hash(password, BCRYPT_COST)
      .then((hash) => {
        return db.query(
          `INSERT INTO users (name, email, password, phone, is_admin)
           VALUES ($1, $2, $3, $4, false)
           RETURNING id;`,
          [name, email, hash, phone]
        );
      })
      .then((data) => {
        req.session.userId = data.rows[0].id;
        res.redirect("/properties");
      })
      .catch((err) => {
        // 23505 = unique_violation (email already registered)
        if (err.code === "23505") {
          return res.status(409).render("register", {
            user: null,
            error: "An account with that email already exists.",
            values,
          });
        }

        console.error(err);
        res.status(500).render("register", {
          user: null,
          error: "Something went wrong. Please try again.",
          values,
        });
      });
  });

  return router;
};
