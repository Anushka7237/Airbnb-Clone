const Review = require("../models/review.js");
const Listing = require("../models/listing.js");


module.exports.createReview=async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      throw new ExpressError(404, "Listing not found");
    }
    if (!req.user._id.equals(listing.owner)) {
      req.flash("error", "Only the listing owner can post reviews");
      return res.redirect(`/listings/${listing._id}`);
    }
    const newreview = new Review(req.body.review);
    newreview.author = req.user._id;
    await newreview.save();
    listing.reviews.push(newreview);
    await listing.save();
    req.flash("success","New review created!!");
    res.redirect(`/listings/${req.params.id}`);
  };

module.exports.destroyReview=async (req, res) => {
    const { id, reviewID } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      throw new ExpressError(404, "Listing not found");
    }
    const review = await Review.findById(reviewID);
    if (!review) {
      throw new ExpressError(404, "Review not found");
    }
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewID } });
    await Review.findByIdAndDelete(reviewID);
    req.flash("success","review deleted!!");
    res.redirect(`/listings/${id}`);
  };