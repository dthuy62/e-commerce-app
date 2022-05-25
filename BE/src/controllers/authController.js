const User = require('../models/user');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

let refreshTokens = [];

const authController = {

  register: async (req, res) => {
    try {
      let {firstName, lastName, username, email, password} = req.body;
      // console.log({ firstName, lastName, email, password })
      if (lastName === '' || firstName === '' || email === '' || password === '')
        return res.status(400).json({msg: "Empty input fields!"})
      const e_mail = await User.findOne({email});
      if (e_mail) return res.status(400).json({msg: "This email already exists."});
      const user_name = await User.findOne({username});
      if (user_name) return res.status(400).json({msg: "This username already exists."})
      if (password.length < 6) return res.status(400).json({msg: "Password must be at least 6 characters."});

      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);

      const newUser = await new User({
        firstName,
        lastName,
        username,
        email,
        password: hashed
      });
      // save to db
      const user = await newUser.save();

      res.status(200).json({
        success: true,
        data: user
      })
    } catch (err) {
      res.status(500).json({
        error: err
      })
    }

  },
  login: async (req, res) => {
    try {
      const {username, password} = req.body;
      const user = await User.findOne({username});
      if (!user) {
        return res.status(404).json("Wrong username");
      }
      const validPassword = await bcrypt.compare(
          password,
          user.password
      );
      if (!validPassword) {
        return res.status(404).json("Wrong password");
      }
      if (user && validPassword) {
        const accessToken = generateAccessToken({id: user._id, role: user.role});
        const refreshToken = generateRefreshToken({id: user._id, role: user.role});
        refreshTokens.push(refreshToken);
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          path: '/api/refresh',
          sameSite: "strict"
        })
        const {password, ...others} = user._doc;
        res.status(200).json({
          user: {...others},
          accessToken,
        })
      }
    } catch (err) {
      res.status(500).json(err)
    }
  },
  logout:  (req, res) => {
    res.clearCookie("refreshToken");
    refreshTokens = refreshTokens.filter(token => token !== req.cookies.refreshToken);
    res.status(200).json("Logged out!");
  },
  requestRefreshToken: async (req, res) => {
    // lấy refreshToken từ user
    try {
      const refreshToken = req.cookies.refreshToken;
      if(!refreshToken) return res.status(400).json({msg: "Oopsssss! You are not logged in!"})
      jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY,  async (err, result) => {
        //
        if(err) {
          console.log(err);
        }
        const user = await User.findById(result.id).select('-password');
        console.log({user})

        const newAccessToken = generateAccessToken({id: result.id, role: result.role});
        // const newRefreshToken = generateRefreshToken({id: result.id, role: result.role});
        // res.cookie("refreshToken", newRefreshToken, {
        //   httpOnly: true,
        //   secure: false,
        //   path: '/api/refresh',
        //   sameSite: "strict"
        // });
        res.status(200).json({
          accessToken: newAccessToken,
          user

        })
      })



    } catch (err) {
      return res.status(500).json(err);
    }


  }
}

const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_KEY, {expiresIn: '30s'})
}
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_KEY, {expiresIn: "365d"})
}

module.exports = authController;