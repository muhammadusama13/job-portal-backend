const express = require('express');
const { body, check } = require('express-validator');
const UserModel = require('../models/user.model');
const UserController = require('../controllers/auth.controller');

const route = express.Router();

// register
route.post(
  '/register',
  [
    body('name', `Name should at least 3 characters`)
      .isLength({ min: 3 })
      .trim(),
    body('email', `Email Enter Valid email.`)
      .notEmpty()
      .bail()
      .isEmail()
      .bail()
      .normalizeEmail()
      .bail()
      .custom((value, { req }) => {
        return UserModel.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject(
              `Email This Email is already exist. Please try with another email !`
            );
          }

          return true;
        });
      }),
    body('password')
      .notEmpty()
      .withMessage("Password is required.")
      .bail()
      .isLength({ min: 6 })
      .withMessage("Password should be at least 6 characters long.")
      .bail()
      .matches(/[a-zA-Z]/)
      .withMessage("Password should contain at least one alphabet sign.")
      .bail()
      .matches(/\d/)
      .withMessage("Password should contain at least one number.")
      .bail()
      .matches(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/)
      .withMessage("'Password' should contain at least one special character."),

    body('conform_password', "Conform Password Please Provide")
      .notEmpty()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password & Conform Password are not matched');
        }
        return true;
      }),
  ],
  UserController.register
);

// login
route.post(
  '/login',
  [
    check('email', 'Email Please enter a valid email address')
      .isEmail()
      .normalizeEmail(),
    body('password', 'Password Required!').notEmpty(),
  ],
  UserController.login
);

module.exports = route;
