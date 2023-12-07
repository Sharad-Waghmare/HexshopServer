import CartModel from "../model/cart.model";
import productsModel from "../model/products.model";
import multer from "multer";
import fs from "fs";
import path from "path";


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (fs.existsSync("./uploads/cart")) {
      cb(null, "./uploads/cart");
    } else {
      fs.mkdirSync("./uploads/cart");
      cb(null, "./uploads/cart");
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

//get all cart items
export const getCartItems = async (req, res)=>{
    try {
        const cartData = await CartModel.find();
        let total = 0;
        if(cartData){
          cartData.map((ele) =>{
            total += ele.subtotal
          });

            return res.status(200).json({
                data: cartData,
                message: "Cart Items Successfully",
                result: cartData.length,
                total: total,
                path:"http://localhost:8001/uploads/product/"
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message,
          });
    }

};

// get add cart
export const addToCart = async (req, res) => {
    try {
      const productID  = req.params.productID;
      console.log(productID)
  
      const productData = await productsModel.findOne({ _id: productID });
  
      const existCartItem = await CartModel.findOne({
        productID: productID,
       
      });
  
      let quantity,price,updatedItem
      if (existCartItem) {
         quantity = existCartItem.quantity + 1;
         price = productData.price * quantity;
        let updatedItem = await CartModel.updateOne(
          {
            _id: existCartItem._id,
          },
          {
            $set: {
              quantity: quantity,
              subtotal: price,
            },
          }
        );
  
        if (updatedItem.acknowledged) {
          return res.status(200).json({
            message: "updated",
          });
        }
      }
  
      const cartData = new CartModel({
        productID: productID,
        name: productData.name,
        price:productData.price,
        subtotal: productData.price,
        quantity: 1,
        thumbnail: productData.thumbnail,
      });
      cartData.save();
      if (cartData) {
        return res.status(201).json({
          data: cartData,
          message: "Successfully added",
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  };

//get update cart
export const updateQuantity = async (req, res) => {
    try {
      const cartID = req.params.cart_id;
      const { updatetype } = req.query;
  
      const cartData = await CartModel.findOne({ _id: cartID })
  
      let quantity = cartData.quantity;
      let subtotal = cartData.price;
  
      if (updatetype === "increment") {
        quantity += 1;
        subtotal = subtotal * quantity;
      }
      if (updatetype === "decrement") {
        quantity -= 1;
        subtotal = subtotal * quantity;
      }
  
      const updatedQuantity = await CartModel.updateOne(
        { _id: cartID },
        {
          $set: {
            quantity: quantity,
            subtotal: subtotal,
          },
        }
      );
      if (updatedQuantity.acknowledged) {
        return res.status(200).json({
          message: "Updated",
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  };


//get delete cart
export const removeFromCart = async (req, res)=>{
    try {
        const cartID = req.params.cart_id;

        const deletedData = await CartModel.deleteOne({_id: cartID});

        if(deletedData.acknowledged){
            return res.status(200).json({
                message: "Deleted"
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

// get delete quantity
export const deleteQuantity = async (req, res) => {
    try {
      const cartId = req.params.cart_id;
  
      const cartData = await CartModel.findOne({ _id: cartId });
  
      let quantity = cartData.quantity <= 0;
      let highQuantity = cartData.quantity >= 10;
      let deleteQuantity = "";
  
      if (quantity) {
        deleteQuantity = await CartModel.deleteOne({ _id: cartId });
      }
  
      if (highQuantity) {
        return res.status(200).json({
          message: "more than",
        });
      }
      if (deleteQuantity.acknowledged) {
        return res.status(200).json({
          data: deleteQuantity,
          message: "deleted",
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  };