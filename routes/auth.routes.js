const express = require("express");
const router = express.Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// How many rounds should bcrypt run the salt (default - 10 rounds)
const saltRound = 10;

// Require the User model in order to interact with the database
const User = require("../models/User.model");

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

// GET /auth/signup
router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

// POST /auth/signup
router.post("/signup", async (req, res, next) => {
  const { fullName, email, password, confirmPassword } = req.body;
  
  try {
    if (
      fullName === "" ||
      email === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      res.status(400).render("auth/signup", {
        errorMessage:
          "All fields are mandatory. Please provide your fullname, email and password.",
      });

      return;
    }

    if (password.length < 6) {
      res.status(400).render("auth/signup", {
        errorMessage: "Your password needs to be at least 6 characters long.",
      });

      return;
    }

    if (password !== confirmPassword) {
      return res.render("auth/signup", {
      errorMessage: "Passwords need to be the same",
      });
    }
    
    // Create a new user - start by hashing the password
    const salt = bcrypt.genSaltSync(saltRound);
    
    const hashedPassword = bcrypt.hashSync(password, salt);
    
    const userCreated = await User.create({
      email,
      fullName,
      password: hashedPassword,
    });
    //config mongos-conect y session-store
    const newUser = userCreated.toObject();
    delete newUser.password;
    //guardar el usuario creado en el req.session para indicar que ya tiene una session activa
    req.session.currentUser = newUser;
    res.redirect("/user/home");

  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(500).render("auth/signup", { errorMessage: error.message });
    } else if (error.code === 11000) {
      res.status(500).render("auth/signup", {
        errorMessage:
          "Fullname and email need to be unique. Either fullname or email is already used.",
      });
    } else {
      next(error);
    }
  }
});

// GET /auth/login
router.get("/login", (req, res) => {
  res.render("auth/login");
});

// POST /auth/login
router.post("/login", async (req, res, next) => {
  const { fullName, email, password } = req.body;
  try {
    // Check that fullname, email, and password are provided
    if (fullName === "" || email === "" || password === "") {
      res.status(400).render("auth/login", {
        errorMessage:
          "All fields are mandatory. Please provide fullname, email and password.",
      });

      return;
    }

    // Here we use the same logic as above
    // - either length based parameters or we check the strength of a password
    if (password.length < 6) {
      return res.status(400).render("auth/login", {
        errorMessage: "Your password needs to be at least 6 characters long.",
      });
    }

    const user = await User.findOne({ email });

    // If the user isn't found, send an error message that user provided wrong credentials
    if (!user) {
      res.status(400);
      res.render("auth/login", { errorMessage: "Wrong credentials." });
      return;
    }

    const match = bcrypt.compareSync(password, user.password);

    // If user is found based on the fullname, check if the in putted password matches the one saved in the database
    if (match) {
      const newUser = user.toObject();
      delete newUser.password;
      req.session.currentUser = newUser;
      res.redirect("/user/home");
    } else {
      res.status(400);
      res.render("auth/login", { errorMessage: "Wrong credentials." });
      return;
    }
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(500).render("auth/login", { errorMessage: error.message });
    } else if (error.code === 11000) {
      res.status(500).render("auth/login", {
        errorMessage: "Fullame and email need to match our database.",
      });
    } else {
      next(error);
    }
  }
});


//logout
router.get("/logout", (req, res, next) => {
  req.session.destroy((error) =>{
      if(error){
          return next(error)
      }
      res.redirect("/")
  })
})
module.exports = router;
