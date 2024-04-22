const Account = require("../models/Account");

module.exports = {
  getAccount: async (req, res) => {
    try {
      const account = await Account.findOne({
        userName: req.user.userName,
      });
      const address = await Address.findOne({
        id: req.user.id,
      });
      if (!account) return res.status(403).json(null);
      res.status(200).json({ ...account.toJSON(), ...address.toJSON() });
    } catch (err) {
      console.log(err);
      res.status(400);
    }
  },
  putDeposit: async (req, res) => {
    try {
      const sum = +req.body.deposit + +req.user.balance;
      await Account.findByIdAndUpdate(req.user.id, {
        balance: sum,
      });
      res.status(200).json("Success!");
    } catch (err) {
      res.status(400).json(err);
    }
  },
};
