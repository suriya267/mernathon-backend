const Product = require("../model/product");

const getAllProducts = async (req, res) => {
  console.log("req.params", req.query);

  try {
    const { page = 1, search = "", sort, category, subCategory } = req.query;
    const limit = 12;
    const skip = (page - 1) * limit;

    const query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // if (category) {
    //   query.category = category;
    // }

    if (category) {
      const categoryArray = category.split(",").map((c) => c.trim());
      query.category = { $in: categoryArray };
    }

    // if (subCategory) {
    //   query.subCategory = subCategory;
    // }
    if (subCategory) {
      const subCategoryArray = subCategory.split(",").map((s) => s.trim());
      query.subCategory = { $in: subCategoryArray };
    }

    let sortOption = {};
    if (sort === "lowToHigh") {
      sortOption.price = 1;
    } else if (sort === "highToLow") {
      sortOption.price = -1;
    }

    console.log("query", query);

    const total = await Product.countDocuments(query);

    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      total,
      page: Number(page),
      limit,
      totalPages: Math.ceil(total / limit),
      products,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product", error });
  }
};

const getLatestProducts = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const limit = 10;
    const skip = (page - 1) * limit;

    const total = await Product.countDocuments({});
    const products = await Product.find({})
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      total,
      page: Number(page),
      limit,
      totalPages: Math.ceil(total / limit),
      products,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch latest products", error });
  }
};

const getBestSellers = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const limit = 5;
    const skip = (page - 1) * limit;

    const total = await Product.countDocuments({ bestseller: true });
    const products = await Product.find({ bestseller: true })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      total,
      page: Number(page),
      limit,
      totalPages: Math.ceil(total / limit),
      products,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bestsellers", error });
  }
};
const getRelatedProducts = async (req, res) => {
  try {
    const { category, subCategory } = req.query;

    if (!category || !subCategory) {
      return res
        .status(400)
        .json({ message: "Category and subCategory are required" });
    }

    const products = await Product.find({
      category,
      subCategory,
    }).limit(5);

    res.status(200).json({
      products,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch related products", error });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  getLatestProducts,
  getBestSellers,
  getRelatedProducts,
};
