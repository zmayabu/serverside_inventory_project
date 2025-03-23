import mongoose from "mongoose";

//Schema for Makeup

const makeupSchema = new mongoose.Schema({
  _id: String,
  name: String,
  brand: 
  {
    type: String,
    ref: "Brand"
  },
  category: String,
  price: Number,
  quantity: Number,
  description: String
}, {collection: 'Makeup'});

const Makeup = mongoose.model("Makeup", makeupSchema);

export { Makeup };
