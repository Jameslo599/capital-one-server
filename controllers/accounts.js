const Account = require("../models/Account");
const Address = require("../models/Address");
const cloudinary = require("../middleware/cloudinary");
const validator = require("validator");

/////////////////////////
// Uploads an image file
/////////////////////////
const uploadImage = async (imagePath) => {
  // Use the uploaded file's name as the asset's public ID and
  // allow overwriting the asset with new versions
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };

  try {
    // Upload the image
    const result = await cloudinary.uploader.upload(imagePath, options);
    return result.secure_url;
  } catch (error) {
    console.error(error);
  }
};

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
  postAvatar: async (req, res) => {
    try {
      const upload = await uploadImage(req.file.path);
      await Account.findByIdAndUpdate(req.user.id, {
        cloudinary_id: upload,
      });
      res.json(upload);
    } catch (err) {
      console.log(err);
      res.status(400);
    }
  },
  putGreeting: async (req, res) => {
    try {
      const message = req.body.message;
      await Account.findByIdAndUpdate(req.user.id, {
        greeting: message,
      });
      res.status(200).json("Success!");
    } catch (err) {
      res.status(400).json(err);
    }
  },
  putAddress: async (req, res) => {
    const validationErrors = [];
    if (
      !validator.isAlphanumeric(req.body.street_address, "en-US", {
        ignore: " ",
      })
    )
      validationErrors.push({
        msg: "Invalid street address",
      });
    if (req.body.apartment_suite) {
      if (
        !validator.isAlphanumeric(req.body.apartment_suite, "en-US", {
          ignore: " ",
        })
      )
        validationErrors.push({
          msg: "Invalid apartment/suite",
        });
    }
    if (
      !validator.isAlpha(req.body.city, "en-US", {
        ignore: " ",
      })
    )
      validationErrors.push({
        msg: "Invalid city",
      });
    if (!validator.isPostalCode(req.body.zip, "US"))
      validationErrors.push({
        msg: "Invalid ZIP code",
      });

    if (validationErrors.length) {
      return res.status(400).json(validationErrors);
    }

    const address = new Address({
      id: req.user.id,
      street_address: req.body.street_address,
      apartment_suite: req.body.apartment_suite,
      city: req.body.city,
      state: req.body.state,
      zip: req.body.zip,
    });
    try {
      const existingUser = await Address.findOne({ id: req.user.id });
      if (existingUser) {
        await Address.findOneAndUpdate(
          { id: req.user.id },
          {
            id: req.user.id,
            street_address: req.body.street_address,
            apartment_suite: req.body.apartment_suite,
            city: req.body.city,
            state: req.body.state,
            zip: req.body.zip,
          }
        );
        return res.status(200).json("Success!");
      }
      await Address.create(address);
      res.status(200).json("Success!");
    } catch (err) {
      res.status(400).json(err);
      console.log(err);
    }
  },
  putMailAddress: async (req, res) => {
    const validationErrors = [];
    if (
      !validator.isAlphanumeric(req.body.mail_address, "en-US", {
        ignore: " ",
      })
    )
      validationErrors.push({
        msg: "Invalid mailing address",
      });
    if (req.body.mail_apartment) {
      if (
        !validator.isAlphanumeric(req.body.mail_apartment, "en-US", {
          ignore: " ",
        })
      )
        validationErrors.push({
          msg: "Invalid apartment/suite",
        });
    }
    if (
      !validator.isAlpha(req.body.mail_city, "en-US", {
        ignore: " ",
      })
    )
      validationErrors.push({
        msg: "Invalid city",
      });
    if (!validator.isPostalCode(req.body.mail_zip, "US"))
      validationErrors.push({
        msg: "Invalid ZIP code",
      });

    if (validationErrors.length) {
      console.log(validationErrors);
      return res.status(400).json(validationErrors);
    }

    try {
      await Address.findOneAndUpdate(
        { id: req.user.id },
        {
          id: req.user.id,
          mail_address: req.body.mail_address,
          mail_apartment: req.body.mail_apartment,
          mail_city: req.body.mail_city,
          mail_state: req.body.mail_state,
          mail_zip: req.body.mail_zip,
        }
      );
      return res.status(200).json("Success!");
    } catch (err) {
      res.status(400).json(err);
      console.log(err);
    }
  },
  putPhone: async (req, res) => {
    const validationErrors = [];
    if (!validator.isMobilePhone(req.body[req.body.use]))
      validationErrors.push({ msg: "Invalid phone number" });

    if (!validator.equals(req.body[req.body.use], req.body.confirm))
      validationErrors.push({ msg: "Phone numbers do not match" });

    if (validationErrors.length) {
      return res.status(400).json(validationErrors);
    }

    try {
      await Account.findByIdAndUpdate(req.user.id, {
        [req.body.use]: req.body.confirm,
      });
      res.status(200).json("Success!");
    } catch (err) {
      console.log(err);
      res.status(400);
    }
  },
  putEmail: async (req, res) => {
    const validationErrors = [];
    if (!validator.isEmail(req.body.email))
      validationErrors.push({ msg: "Invalid email" });

    if (!validator.equals(req.body.email, req.body.confirm))
      validationErrors.push({ msg: "Emails do not match" });

    if (validationErrors.length) {
      return res.status(400).json(validationErrors);
    }
    req.body.email = validator.normalizeEmail(req.body.email, {
      gmail_remove_dots: false,
    });
    try {
      const existingEmail = await Account.findOne({ email: req.body.email });
      if (existingEmail) {
        return res.status(400).json([{ msg: "Email already in use" }]);
      }
      await Account.findByIdAndUpdate(req.user.id, {
        email: req.body.email,
      });
      res.status(200).json("Success!");
    } catch (err) {
      console.log(err);
      res.status(400);
    }
  },
  putUsername: async (req, res) => {
    try {
      const existingUser = await Account.findOne({
        userName: req.body.userName,
      });
      if (existingUser)
        return res.status(401).json([{ msg: "Username already in use" }]);

      const user = await Account.findOne({
        userName: req.user.userName,
      });
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (err) {
          console.log(err);
          return res.status(500).json("An error occurred.");
        }
        if (isMatch) {
          user.userName = req.body.userName;
          user.save();
          return res.json("signout");
        }
        return res.status(401).json([{ msg: "Invalid password." }]);
      });
    } catch (err) {
      console.log(err);
      res.status(400);
    }
  },
  putPassword: async (req, res) => {
    try {
      const user = await Account.findOne({
        userName: req.user.userName,
      });
      user.comparePassword(req.body.currentPass, (err, isMatch) => {
        if (err) {
          console.log(err);
          return res.status(500).json("An error occurred.");
        }
        if (isMatch) {
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

          try {
            if (req.body.currentPass === req.body.password)
              return res.status(400).json([
                {
                  msg: "New password cannot be identical to the last password",
                },
              ]);
            user.password = req.body.password;
            user.save();
            return res.status(200).json("signout");
          } catch (error) {
            console.log(error);
          }
        }
        return res.status(401).json([{ msg: "Invalid password." }]);
      });
    } catch (err) {
      console.log(err);
      res.status(400);
    }
  },
};
