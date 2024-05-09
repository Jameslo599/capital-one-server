const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const logger = require("morgan");
const connectDB = require("./config/database");
const accountRoutes = require("./routes/accounts");
const cors = require("cors");

require("dotenv").config({ path: "./config/.env" });

// Passport config
require("./config/passport")(passport);

connectDB().then(() => {
  app.use(
    session({
      secret: "ewhf",
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        client: mongoose.connection.getClient(),
        dbName: "capital-one",
      }),
      cookie: {
        // Customize session cookie options here
        maxAge: 3 * 24 * 60 * 60 * 1000, // Session expiration time (in milliseconds)
        secure: true, // Set to true if serving over HTTPS
        httpOnly: true, // Restrict access to cookies from client-side JavaScript
        sameSite: "none", // Prevent cross-site request forgery
        // Other cookie options...
      },
    })
  );
});

const corsOptions = {
  origin: "https://codabank.netlify.app", //Your Client, do not write '*'
  credentials: true,
};
app.use(cors(corsOptions));

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "https://codabank.netlify.app"); // Set specific origin
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, DELETE"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true"); // Enable credentials
  next();
});

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger("dev"));
// Sessions
app.set("trust proxy", 1);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use("/api", accountRoutes);

app.listen(process.env.PORT || 8000, () => {
  console.log(`Server is running on port ${process.env.PORT || 8000}`);
});
