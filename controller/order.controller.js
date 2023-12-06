import orderModel from "../model/order.model";
import cartModel from "../model/cart.model";
import productsModel from "../model/products.model";



//get order 
export const getOrder = async (req, res)=>{
    try {
        const userID = "649eb25690163d546d1a9504";
        const cartData = await orderModel.find({userID: userID});
        if(cartData){
            return res.status(200).json({
                data: cartData,
                message: "Cart Items Successfully"
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message,
          });
    }

};


//get add order
export const addOrder = async (req, res) => {
    try {
      const { userid, cartid } = req.body;
  
      const cartData = await cartModel.findOne({ _id: cartid });
  
      const orderData = new orderModel({
        userID: userid,
        productID: cartData.productID,
        price: cartData.price,
        quantity: cartData.quantity,
        thumbnail: cartData.thumbnail,
      });
      orderData.save();
      if (orderData) {
        return res.status(201).json({
          data: orderData,
          message: "Successfully added",
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  };