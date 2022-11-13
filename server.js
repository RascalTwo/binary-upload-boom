const fs = require('fs');
const path = require('path');
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const methodOverride = require("method-override");
const flash = require("express-flash");
const logger = require("morgan");
const cors = require("cors");
const connectDB = require("./config/database");
const mainRoutes = require("./routes/main");
const postRoutes = require("./routes/posts");
const commentRoutes = require("./routes/comments");
const followRoutes = require("./routes/follows");

//Use .env file in config folder
require("dotenv").config({ path: "./config/.env" });

// Passport config
require("./config/passport")(passport);

app.set("trust proxy", true);

app.use(cors({
  origin: (origin, callback) => callback(null, true),
  credentials: true
}));

//Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Logging
app.use(logger("dev"));

//Use forms for put / delete
app.use(methodOverride("_method"));

//Connect To Database
connectDB().then(() => {
  // Setup Sessions - stored in MongoDB
  app.use(
    session({
      secret: "keyboard cat",
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
  );

  // Passport middleware
  app.use(passport.initialize());
  app.use(passport.session());

  //Use flash messages for errors, info, ect...
  app.use(flash());

  function renderIndex(req, res){
    const html = fs.readFileSync(path.join(__dirname, 'frontend/build/index.html')).toString();
    const injectedHTML = html.replace('INITIAL_USER', JSON.stringify(req.user || null));
    res.send(injectedHTML);
  }

  app.get('/', renderIndex)

  //Static Folder
  app.use(express.static("frontend/build"));

  //Setup Routes For Which The Server Is Listening
  app.use("/", mainRoutes);
  app.use("/api/post", postRoutes);
  app.use("/api/comment", commentRoutes);
  app.use("/api/follow", followRoutes);

  app.use('*', renderIndex);

  //Server Running
  app.listen(process.env.PORT, () => {
    console.log("Server is running, you better catch it!");
  });
});