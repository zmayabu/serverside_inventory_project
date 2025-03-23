import mongoose from "mongoose";

//Schema for Brand

const brandSchema = new mongoose.Schema({
  _id: String,
  name: String,
  country: String,
  products: [
    {
      type: String,
      ref: "Makeup"
    }
  ]

}, {collection: 'Brand'});

const Brand = mongoose.model("Brand", brandSchema);

export { Brand };