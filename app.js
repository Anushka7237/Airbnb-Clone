try {
  require('dotenv').config();
} catch (e) {
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const fs = require('fs');
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const method_override = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const session = require("express-session");
const MongoStore=require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl=process.env.ATLASDB_URL;

const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600,
});

store.on("error",()=>{
  console.log("ERROR IN MONGO SESSION STORE",err);
});

const sessionoptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


// app.get("/", (req, res) => {
//   res.send("hi I'm a root");
// });

app.use(session(sessionoptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(method_override("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// Log incoming requests to help debug double-response errors
app.use((req, res, next) => {
  console.log('Incoming request:', req.method, req.originalUrl);
  next();
});

const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userRouter);

async function main() {
  await mongoose.connect(dbUrl);
  console.log("Connected to DB");
}
main().catch((err) => console.log(err));

app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found!!"));
});

app.use((err, req, res, next) => {
  const { statuscode = 500, message = "Something went wrong" } = err;
  if (statuscode === 400 && req.method === "POST") {
    req.flash("error", message);
    return res.redirect("/listings");
  }
  // Guard against double responses
  if (res.headersSent) {
    return next(err);
  }
  res.status(statuscode).render("error.ejs", { message });
});

app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});
