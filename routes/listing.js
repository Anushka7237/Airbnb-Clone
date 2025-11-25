const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const Review = require("../models/review");
const ExpressError = require("../utils/ExpressError");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const multer  = require('multer');
const {storage}=require('../cloudConfig.js');
const upload = multer({storage});

const listingControlller = require("../controllers/listing.js");


// INDEX ROUTE and CREATE ROUTE
router
  .route("/")
  .get(wrapAsync(listingControlller.index))
  .post(
    isLoggedIn,
    // accept a single file named `image` from the form
    upload.single('image'),
    validateListing,
    wrapAsync(listingControlller.createListing)
  );
  
  
  // NEW ROUTE
  router.get("/new", isLoggedIn, listingControlller.renderNewForm);
  
  //SHOW ONE LISTING and UPDATE LISTING and DELETE LISTING
  router
  .route("/:id")
  .get(wrapAsync(listingControlller.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single('image'),
    validateListing,
    wrapAsync(listingControlller.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingControlller.destroyListing));


//EDIT ROUTE
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingControlller.renderEditForm)
);

module.exports = router;
