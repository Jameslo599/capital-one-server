const Account = require("../models/Account");
const Transaction = require("../models/Transaction");

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
        balance: sum.toFixed(2),
      });
      //Log Transaction
      const transaction = {
        id: req.user.id,
        reason: "Deposit",
        amount: "+$" + (+req.body.deposit).toFixed(2),
        balance: "$" + sum.toFixed(2),
      };
      await Transaction.create(transaction);
      res.status(200).json("Funds deposited!");
    } catch (err) {
      res.status(400).json(err);
    }
  },
  putWithdraw: async (req, res) => {
    try {
      const difference = +req.user.balance - +req.body.withdraw;
      if (difference < 0)
        return res.status(400).json([{ msg: "Insufficient funds" }]);
      await Account.findByIdAndUpdate(req.user.id, {
        balance: difference.toFixed(2),
      });
      //Log Transaction
      const transaction = {
        id: req.user.id,
        reason: "Withdraw",
        amount: "-$" + (+req.body.withdraw).toFixed(2),
        balance: "$" + difference.toFixed(2),
      };
      await Transaction.create(transaction);
      res.status(200).json("Funds withdrawn!");
    } catch (err) {
      res.status(400).json(err);
    }
  },
  putSend: async (req, res) => {
    try {
      const recipient = await Account.findOne({
        email: req.body.email,
      });
      if (!recipient || recipient.email === req.user.email)
        return res
          .status(400)
          .json([{ msg: "Recipient email does not exist" }]);

      const sum = +recipient.balance + +req.body.amount;
      const difference = +req.user.balance - +req.body.amount;
      if (difference < 0)
        return res.status(400).json([{ msg: "Insufficient funds" }]);
      //User
      await Account.findByIdAndUpdate(req.user.id, {
        balance: difference.toFixed(2),
      });
      //Recipient
      await Account.findByIdAndUpdate(recipient.id, {
        balance: sum.toFixed(2),
      });
      //Log Transaction
      const transaction = {
        id: req.user.id,
        sender: req.user.email,
        recipient: req.body.email,
        amount: "-$" + (+req.body.amount).toFixed(2),
        balance: "$" + difference.toFixed(2),
        reason: req.body.reason,
        name: `${req.user.fname} ${req.user.lname}`,
      };
      await Transaction.create(transaction);
      const recipientLog = {
        id: recipient.id,
        sender: req.user.email,
        recipient: req.user.email,
        amount: "+$" + (+req.body.amount).toFixed(2),
        balance: "$" + sum.toFixed(2),
        reason: req.body.reason,
      };
      await Transaction.create(recipientLog);
      res.status(200).json("Funds sent!");
    } catch (err) {
      res.status(400).json(err);
    }
  },
  getHistory: async (req, res) => {
    try {
      const history = await Transaction.find({ id: req.user.id });
      res.status(200).json(history);
    } catch (err) {
      res.status(400).json(err);
    }
  },
};
