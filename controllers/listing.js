const Listing = require("../models/listing");
const path = require("path");
const fs = require("fs");

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
        model: "User",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!!");
    return res.redirect("/listings");
  }
  console.log('showListing: NODE_ENV=', process.env.NODE_ENV, 'GEOAPIFY_KEY present=', !!process.env.GEOAPIFY_KEY);

  let mapCenter = null;
  try {
    const apiKey = process.env.GEOAPIFY_KEY;
    const address = [listing.location, listing.country].filter(Boolean).join(', ');
    if (apiKey && address) {
      if (typeof fetch === 'undefined') {
        console.warn('Global fetch is not available; skipping server-side geocoding.');
      } else {
        const geocodeUrl = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&limit=1&apiKey=${apiKey}`;
        const geoRes = await fetch(geocodeUrl);
        const geo = await geoRes.json();
        if (geo && geo.features && geo.features.length) {
          const coords = geo.features[0].geometry.coordinates; // [lon, lat]
          mapCenter = { lat: coords[1], lon: coords[0] };
        }
      }
    }
  } catch (err) {
    console.error('Server geocoding failed:', err);
  }

  res.render('listings/show', { listing, mapCenter });
};

module.exports.createListing = async (req, res, next) => {
  let url, filename;
  if (req.file) {
    filename = req.file.filename;
    if (req.file.path && req.file.path.toString().startsWith("http")) {
      url = req.file.path;
    } else {
      url = `/uploads/${filename}`;
    }
  }
  const newlisting = new Listing(req.body.listing);
  newlisting.owner = req.user._id;
  if (url && filename) newlisting.image = { url, filename };
  await newlisting.save();
  req.flash("success", "New listing created!!");
  res.redirect("/listings");
};

module.exports.index = async (req, res) => {
  const alllisting = await Listing.find({});
  res.render("listings/index", { alllisting });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!!");
    return res.redirect("/listings");
  }
  let originalImageUrl = "";
  if (listing.image && listing.image.url) {
    const imgUrl = listing.image.url;
    if (imgUrl.startsWith("http")) {
      if (imgUrl.includes("/upload")) {
        originalImageUrl = imgUrl.replace("/upload", "/upload/h_300,w_250");
      } else {
        originalImageUrl = imgUrl;
      }
    } else {
      if (imgUrl.startsWith("/")) {
        originalImageUrl = imgUrl;
      } else {
        const filename = path.basename(imgUrl);
        const candidate = path.join(
          __dirname,
          "..",
          "public",
          "uploads",
          filename
        );
        if (fs.existsSync(candidate)) {
          originalImageUrl = `/uploads/${filename}`;
        } else {
          originalImageUrl = imgUrl;
        }
      }
    }
  }
  res.render("listings/edit", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  const updateData = { ...req.body.listing };
  if (updateData.image && typeof updateData.image === "string") {
    updateData.image = {
      filename: "listingimage",
      url: updateData.image,
    };
  }
  if (typeof req.file != "undefined") {
    let filename = req.file.filename;
    let url;
    if (req.file.path && req.file.path.toString().startsWith("http")) {
      url = req.file.path;
    } else {
      url = `/uploads/${filename}`;
    }
    listing.image = { url, filename };
    await listing.save();
  }
  const listing1 = await Listing.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
  if (!listing1) {
    throw new ExpressError(404, "Listing not found");
  }
  req.flash("success", "Listing Updated!!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  const deleted = await Listing.findByIdAndDelete(id);
  if (!deleted) {
    throw new ExpressError(404, "Listing not found");
  }
  req.flash("success", "Listing Deleted Successfully!!");
  res.redirect("/listings");
};