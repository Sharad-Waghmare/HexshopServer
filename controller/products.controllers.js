import ProductModel from "../model/products.model";
import multer from "multer";
import fs from "fs";
import path from "path";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (fs.existsSync("./uploads/product")) {
      cb(null, "./uploads/product");
    } else {
      fs.mkdirSync("./uploads/product");
      cb(null, "./uploads/product");
    }
  },
  filename: function (req, file, cb) {
    const name = file.originalname;
    const ext = path.extname(name);
    const nameArr = name.split(".");
    nameArr.pop();
    const fname = nameArr.join(".");
    const fullname = fname + "-" + Date.now() + ext;
    cb(null, fullname);
  },
});

const upload = multer({ storage: storage });

// get all product
export const getAllProduct = async (req, res) => {
  try {
    const { q, size, page, min, max } = req.query;
    

    const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
    const searchRgx = rgx(q);

    let filtered = {};
    if (q !== undefined || (min !== undefined && max !== undefined)) {
      filtered = {
        $or: [
          { name: { $regex: searchRgx, $options: "i" } },
          { description: { $regex: searchRgx, $options: "i" } },
          { price: { $gte: min, $lte: max } },
        ],
      };
    }
    let skipno = size * (page - 1);
    const ProductData = await ProductModel.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categories",
        },
      },
      { $unwind: "$category" },
      {
        $lookup: {
          from: "sub-categories",
          localField: "subcategory",
          foreignField: "_id",
          as: "sub-categories",
        },
      },
      { $unwind: "$subcategory" },
    ]) .sort({ price: 1 })
      .match(filtered);

    if (ProductData) {
      return res.status(200).json({
        data: ProductData,
        message: "success",
        path:"http://localhost:8001/uploads/product",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};



// get add product
export const addProduct = (req, res) => {
  try {
    const uploadData = upload.fields([
      { name: "thumbnail", maxCount: 1 },
      { name: "images", maxCount: 4 },
    ]);
   
    uploadData(req, res, function (error) {
      if (error) return res.status(400).json({ message: error.message });

      const {
        name,
        category,
        subcategory,
        quantity,
        price,
        shortDescription,
        description,
      } = req.body;

      let image = [];
      let thumbnail = null;

      if (req.files && req.files["thumbnail"]) {
        thumbnail = req.files["thumbnail"][0].filename;
      }
    
      if (req.files && req.files["images"]) {
        req.files["images"].forEach((file) => {
          image.push(file.filename);
        });
      }

      const createdRecord = new ProductModel({
        name: name,
        category: category,
        subcategory: subcategory,
        quantity: quantity,
        price: price,
        shortDescription: shortDescription,
        description: description,
        thumbnail: thumbnail,
        images: image.join(","),
      });

      createdRecord.save();
     

      if (createdRecord) {
        return res.status(201).json({
          data: createdRecord,
          message: "Success",
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

//get single product
export const getProduct = async (req, res) => {
  try {
    const id = req.params.product_id;

    const productData = await ProductModel.findOne({ _id: id });

    const image = productData.images.split(",");
    console.log(image[1]);
    for (let i = 0; i < image.length; i++) {
      console.log("jay ", image[i]);
    }
    if (productData) {
      return res.status(200).json({
        data: productData,
        message: "Success",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};


// get Update product
export const updateProduct = async (req, res) => {
  try {
    const uploadData = upload.fields([
      { name: "thumbnail", maxCount: 1 },
      { name: "images", maxCount: 4 },
    ]);
    uploadData(req, res, async function (err) {
      if (err) return res.status(400).json({ message: err.message });

      const product_id = req.params.product_id;

      const {
        name,
        category,
        subcategory,
        quantity,
        price,
        shortDescription,
        description,
      } = req.body;

      const productData = await ProductModel.findOne({
        _id: product_id,
      });

      let thumbnail = productData.thumbnail;
      let image = [];
      console.log(thumbnail);

      if (req.files && req.files["thumbnail"]) {
        thumbnail = req.files["thumbnail"][0].filename;
        if (fs.existsSync("./uploads/product/" + productData.thumbnail)) {
          fs.unlinkSync("./uploads/product/" + productData.thumbnail);
        }
      }

      if (req.files && req.files["images"]) {
        req.files["images"].forEach((file) => {
          image.push(file.filename);
          for (let i = 0; i < image.length; i++) {
            if (fs.existsSync("./uploads/product/" + image[i])) {
              fs.unlinkSync("./uploads/product/" + image[i]);
            }
          }
        });
      }

      const updatedProduct = await ProductModel.updateOne(
        { _id: product_id },
        {
          $set: {
            name: name,
            category: category,
            subcategory: subcategory,
            quantity: quantity,
            price: price,
            shortDescription: shortDescription,
            description: description,
            thumbnail: thumbnail,
            images: image.join(","),
          },
        }
      );
      if (updatedProduct.acknowledged) {
        return res.status(200).json({
          message: "Updated",
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};


// get Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product_id = req.params.product_id;

    const productData = await ProductModel.findOne({ _id: product_id });

    const images = productData.images.split(",");

    for (let i = 0; i < images.length; i++) {
      const imagePath = "./uploads/products/" + images[i];
      if (fs.existsSync(imagePath) && fs.statSync(imagePath).isFile()) {
        fs.unlinkSync(imagePath);
      }
    }

    const thumbnailPath = "./uploads/products/" + productData.thumbnail;
    if (fs.existsSync(thumbnailPath) && fs.statSync(thumbnailPath).isFile()) {
      fs.unlinkSync(thumbnailPath);
    }

    const deletedProduct = await ProductModel.deleteOne({ _id: product_id });
    if (deletedProduct.acknowledged) {
      return res.status(200).json({
        data: deletedProduct,
        message: "Product Deleted Successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};


 