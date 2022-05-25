const User = require('../models/user');

const userController = {
  changeRole: async (req, res) => {
    try {
      const { role, id } = req.body;
      const user = await User.findOneAndUpdate({_id: req.body.id}, {
        role,
        id
      });
      console.log(user)
    } catch (err) {
      return res.status(500).json({msg: err.message})
    }
  }
}

module.exports = userController;