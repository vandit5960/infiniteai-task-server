import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String },
  color: { type: String },
  category: { type: String },
  price: { type: Number },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const ProductModel = mongoose.model("Product", productSchema);

export default ProductModel;
