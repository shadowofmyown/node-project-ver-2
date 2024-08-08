const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const errorController = require("./controllers/error");
const mongoConnect = require("./util/database").mongoConnect;
const User = require("./models/user");
const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
//  Middleware functions are functions that have access to the request object (req), the response object (res),
// and the next middleware function in the application’s request-response cycle. Here’s why app.use is important:
app.use((req, res, next) => {
  User.findById("6696bed2d0aac7db9057e8d3").then((user) => {
    console.log("usernishant", user.cart);
    req.user = new User(user.name, user.email, user.cart, user._id);
    next();
  });
});
//req.user = user;: Once the user is found, this line assigns the found user object to the user property
//  of the req (request) object. This makes the user object available throughout the rest of the request lifecycle,
//  meaning other middleware and route handlers can access req.user.
app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
  app.listen(3000);
});
