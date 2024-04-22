const passport = require("passport");
const validator = require("validator");
const Account = require("../models/Account");
const Address = require("../models/Address");

function getRandomInt(max) {
  return Math.floor(Math.random() * max).toString();
}

async function genBankNum(length) {
  let num = "1";
  for (let i = 0; i < length; i++) {
    num += getRandomInt(10);
  }
  num = +num;
  try {
    const existingNum =
      num.length === 10
        ? await Account.findOne({ accNum: num })
        : await Account.findOne({ routing: num });

    if (existingNum) {
      return genBankNum(length);
    }
    return num;
  } catch (error) {
    console.log(error);
  }
}

exports.postLogin = (req, res, next) => {
  const validationErrors = [];
  if (validator.isEmpty(req.body.userName))
    validationErrors.push({ msg: "Username cannot be blank." });
  if (validator.isEmpty(req.body.password))
    validationErrors.push({ msg: "Password cannot be blank." });

  if (validationErrors.length) {
    return res.status(400).json(validationErrors);
  }

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json(info);
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(200).json("Success! Logging in...");
    });
  })(req, res, next);
};

exports.getLogged = (req, res) => {
  if (req.isAuthenticated()) {
    return res.json(req.user.userName);
  } else {
    res.json(false);
  }
};

exports.logout = (req, res) => {
  res.clearCookie("connect.sid");
  req.logout((err) => {
    if (err) res.status(400).json("Error logging out");
    req.session.destroy((err) => {
      if (err)
        res
          .status(400)
          .json("Error : Failed to destroy the session during logout.");
      req.user = null;
      res.status(200).json("User has logged out.").send();
    });
  });
};

exports.postSignup = async (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body[0].email))
    validationErrors.push({ msg: "Please enter a valid email address" });
  if (!validator.isLength(req.body[0].password, { min: 8 }))
    validationErrors.push({
      msg: "Password must be at least 8 characters long",
    });
  if (!validator.isStrongPassword(req.body[0].password))
    validationErrors.push({
      msg: "Password must contain at least 8 characters and include at least 1 lowercase, uppercase, number and symbol",
    });
  if (!validator.isAfter(req.body[0].dob, { comparisonDate: "1910-01-01" }))
    validationErrors.push({
      msg: "Date of birth must be after 1/1/1910",
    });
  if (!validator.isBefore(req.body[0].dob))
    validationErrors.push({
      msg: "Date of birth must be today or before today",
    });
  if (!validator.isMobilePhone(req.body[0].mobile))
    validationErrors.push({ msg: "Invalid phone number" });
  if (!validator.isNumeric(req.body[0].balance))
    validationErrors.push({
      msg: "Balance must only contain numbers",
    });

  //Address
  if (
    !validator.isAlphanumeric(req.body[1].street_address, "en-US", {
      ignore: " ",
    })
  )
    validationErrors.push({
      msg: "Invalid street address",
    });
  if (req.body[1].apartment_suite) {
    if (
      !validator.isAlphanumeric(req.body[1].apartment_suite, "en-US", {
        ignore: " ",
      })
    )
      validationErrors.push({
        msg: "Invalid apartment/suite",
      });
  }
  if (
    !validator.isAlpha(req.body[1].city, "en-US", {
      ignore: " ",
    })
  )
    validationErrors.push({
      msg: "Invalid city",
    });
  if (!validator.isPostalCode(req.body[1].zip, "US"))
    validationErrors.push({
      msg: "Invalid ZIP code",
    });

  if (validationErrors.length) {
    return res.status(400).json(validationErrors);
  }
  req.body[0].email = validator.normalizeEmail(req.body[0].email, {
    gmail_remove_dots: false,
  });

  const accNum = await genBankNum(9);
  const routing = await genBankNum(8);
  const user = new Account({
    userName: req.body[0].userName.toLowerCase(),
    password: req.body[0].password,
    email: req.body[0].email,
    fname: req.body[0].fname.toLowerCase(),
    lname: req.body[0].lname.toLowerCase(),
    dob: req.body[0].dob,
    mobile: req.body[0].mobile,
    balance: req.body[0].balance,
    accNum: accNum,
    routing: routing,
  });

  try {
    const existingUser = await Account.findOne(
      { email: req.body[0].email } || { userName: req.body[0].userName }
    );
    if (existingUser) {
      return res
        .status(400)
        .json("Account with that email address or username already exists.");
    }
    const account = await Account.create(user);
    const id = account._id;

    const address = new Address({
      id: id,
      street_address: req.body[1].street_address,
      apartment_suite: req.body[1].apartment_suite,
      city: req.body[1].city,
      state: req.body[1].state,
      zip: req.body[1].zip,
    });

    await Address.create(address);
    await req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      res.status(200).json(user.userName);
    });
  } catch (error) {
    console.log(error);
  }
};

exports.postForgot = async (req, res) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: "Please enter a valid email address" });
  if (!validator.isAlpha(req.body.lname))
    validationErrors.push({
      msg: "Last name should contain letters only",
    });
  if (!validator.isAfter(req.body.dob, { comparisonDate: "1910-01-01" }))
    validationErrors.push({
      msg: "Date of birth must be after 1/1/1910",
    });
  if (!validator.isBefore(req.body.dob))
    validationErrors.push({
      msg: "Date of birth must be today or before today",
    });

  if (validationErrors.length) {
    return res.status(400).json(validationErrors);
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  try {
    const query = Account.where({
      email: req.body.email,
      lname: req.body.lname.toLowerCase(),
      dob: req.body.dob,
    });
    const existingUser = await query.findOne();
    if (existingUser) {
      return res.status(200).json(existingUser.userName);
    }
    res.status(400).json("An Account does not exist with given information");
  } catch (error) {
    console.log(error);
  }
};

exports.putResetPassword = async (req, res) => {
  const validationErrors = [];
  if (!validator.isStrongPassword(req.body.password))
    validationErrors.push({
      msg: "Password must contain at least 8 characters and include at least 1 lowercase, uppercase, number and symbol",
    });
  if (!validator.equals(req.body.password, req.body.confirm))
    validationErrors.push({
      msg: "Passwords do not match",
    });

  if (validationErrors.length) {
    return res.status(400).json(validationErrors);
  }

  let secret = +req.params.username;
  try {
    const existingUser = await Account.findOne({
      userName: secret.toString(36).toLowerCase(),
    });
    existingUser.comparePassword(req.body.password, (err, isMatch) => {
      if (err) {
        console.log(err);
        return res.status(500).json([{ msg: "An error occurred." }]);
      }
      if (isMatch) {
        return res
          .status(400)
          .json([
            { msg: "New password cannot be identical to the last password" },
          ]);
      }
      existingUser.password = req.body.password;
      existingUser.save();
      return res.status(200).json("Your password has been updated!");
    });
  } catch (error) {
    console.log(error);
  }
};
