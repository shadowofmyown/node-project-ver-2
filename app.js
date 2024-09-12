const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const errorController = require("./controllers/error");
const User = require("./models/user");
const mongoose = require("mongoose");
const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
console.log("nishant", User);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
//  Middleware functions are functions that have access to the request object (req), the response object (res),
// and the next middleware function in the application’s request-response cycle. Here’s why app.use is important:
app.use((req, res, next) => {
  User.findById("66c61c947e60fc74ca2753e3")
    .then((user) => {
      if (!user) {
        return next(new Error("User not found"));
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
      next(err); // Pass the error to the next middleware for error handling
    });
});

//req.user = user;: Once the user is found, this line assigns the found user object to the user property
//  of the req (request) object. This makes the user object available throughout the rest of the request lifecycle,
//  meaning other middleware and route handlers can access req.user.
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);
mongoose
  .connect("mongodb://localhost:27017")
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        console.log("result", result);
        const user = new User({
          name: "Max",
          email: "max@test.com",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });

    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
