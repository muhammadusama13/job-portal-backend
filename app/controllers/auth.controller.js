const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');

// register
module.exports.register = (req, res, next) => {
  const validErrors = validationResult(req);

  if (!validErrors.isEmpty()) {
    const errorDetail = validErrors.array().map((error) => {
      return error.msg;
    });

    const error = new Error('Input Validation Error');
    error.detail = errorDetail;
    error.status = 422;
    throw error;
  }
  const { name, email, password } = req.body;
  bcrypt
    .hash(password, 12)
    .then((encrptPassword) => {
      const user = new UserModel({
        name,
        email,
        password: encrptPassword,
      });
      return user.save();
    })
    .then((user) => {
      res.json({
        message: 'user has been added!',
        user,
      });
    })
    .catch((err) => {
      next(err);
    });
};

// login
exports.login = async (req, res, next) => {
  try {
    const validErrors = validationResult(req);

    if (!validErrors.isEmpty()) {
      const errorDetail = validErrors.array().map((error) => {
        return error.msg;
      });

      const error = new Error('Input Validation Error');
      error.detail = errorDetail;
      error.status = 422;
      throw error;
    }

    const { email, password } = req.body;

    const user = await UserModel.findOne({ email: email });

    if (!user) {
      const error = new Error('Please Enter Valid Email & Password');
      error.status = 202;
      throw error;
    }

    const passwordMatched = await bcrypt.compare(password, user.password);

    if (!passwordMatched) {
      const error = new Error('Please Enter Valid Email & Password');
      error.status = 202;
      throw error;
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
      },
      process.env.JWT_TOKEN_SECRET_KEY,
      { expiresIn: '7d' }
    );

    await user.save();

    const user_data_send = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };

    res.status(200).json({
      message: 'User Login',
      token: token,
      user: user_data_send,
    });
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    next(error);
  }
};
