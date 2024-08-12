import ProductModel from "../model/productModel.js";

export const insertProduct = async (req, res) => {
  try {
    const newProduct = new ProductModel({
      ...req.body,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error inserting product", error });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await ProductModel.findOne({
      _id: id,
    });

    const updatedProduct = await ProductModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await ProductModel.findById({
      _id: id,
    });


    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found or unauthorized" });
    }

    await ProductModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
};

export const getAdminProduct = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const products = await ProductModel.find()
      .skip(skip)
      .limit(limit);

    const totalProducts = await ProductModel.countDocuments();

    res.json({
      products,
      totalPages: Math.ceil(totalProducts/limit),
      totalRecords:totalProducts,
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserProduct = async (req, res) => {
  try {
    const userId = req.query.userId;

    const products = await ProductModel.find({ userId:userId });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user products", error });
  }
};

export const getGroupedProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const products = await ProductModel.find().populate("userId", "email");

    // Group products by user email
    const groupedProducts = products.reduce((acc, product) => {
      const userEmail = product.userId.email;
      if (!acc[userEmail]) {
        acc[userEmail] = [];
      }
      acc[userEmail].push(product);
      return acc;
    }, {});

    // Convert groupedProducts to an array of entries for pagination
    const groupedArray = Object.entries(groupedProducts);

    // Paginate grouped array
    const paginatedGroup = groupedArray.slice(skip, skip + limit);

    res.status(200).json({
      products: paginatedGroup,
      totalPages: Math.ceil(groupedArray.length / limit),
      currentPage: page,
      totalRecords: groupedArray.length,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching products", error: err });
  }
};

  
