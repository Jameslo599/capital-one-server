const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  fname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
    required: true,
  },
  dob: {
    type: String,
    required: true,
  },
  balance: {
    type: String,
    required: true,
  },
  cloudinary_id: {
    type: String,
    required: false,
  },
  greeting: {
    type: String,
    required: false,
  },
  mobile: {
    type: String,
    required: false,
  },
  home: {
    type: String,
    required: false,
  },
  work: {
    type: String,
    required: false,
  },
  accNum: {
    type: Number,
    required: true,
  },
  routing: {
    type: Number,
    required: true,
  },
});

// Password hash middleware.
AccountSchema.pre("save", function save(next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

// Helper method for validating user's password.
AccountSchema.methods.comparePassword = function comparePassword(
  candidatePassword,
  cb
) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

module.exports = mongoose.model("Account", AccountSchema);
