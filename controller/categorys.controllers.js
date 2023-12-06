import categorysModel from "../model/categorys.model";
import path from "path";
import fs from "fs";
import multer from "multer";


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        if (fs.existsSync("./uploads/category")) {
            cb(null, "./uploads/category");
        } else {
            fs.mkdirSync("./uploads/category");
            cb(null, "./uploads/category");
        }
    },
    filename: function(req, file, cb) {
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

// get all category
export const getCategories = async (req, res)=>{
    try {
        const categoryDatas = await categorysModel.find();
        if(categoryDatas){
            return res.status(200).json({
                data: categoryDatas,
                message: "Success",
                path:"http://localhost:8001/uploads/category"
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: err.message,
          });
    }
};

//get add categorydata
export const getAddcategoryData = (req, res) => {
    try {
        const uploadDatas = upload.single("image");
        uploadDatas(req, res, function(err){
            if(err) return res.status(400).json({message: err.message});

            const { name } = req.body;

            let image = null;
            if (req.file !== undefined) {
                image = req.file.filename;
            }

            const createdData = new categorysModel({
                name: name,
                image: image

            });

            createdData.save();

            if(createdData){
                return res.status(201).json({
                    data: createdData,
                    message: "user data"
                })
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};


//get single categorydata
export const getSingleCategory = async (req, res)=>{
    try {
        const categorysId = req.params.category_id;

        const categorysData = await categorysModel.findOne({_id: categorysId});
        if(categorysData){
            return res.status(200).json({
                data: categorysData,
                message: "Success",
            });
        }

    } catch (error) {
        return res.status(500).json({
            message: err.message,
        });
    }
};


// get update category
export const getUpdatecategory = async (req, res)=>{
    try {
        
        const uploadData = upload.single("image");
    uploadData(req, res, async function (err) {
      if (err) return res.status(400).json({ message: err.message });
      const category_id = req.params.category_id;

      
      const { name } = req.body;

      const categoryData = await categorysModel.findOne({ _id: category_id });

      let image = categoryData.image; //oldname

      if (req.file !== undefined) {
        image = req.file.filename;
        if (fs.existsSync("./uploads/" + categoryData.image)) {
          fs.unlinkSync("./uploads/" + categoryData.image);
        }
      }
      const updatedData = await categorysModel.updateOne(
        { _id: category_id },
        {
          $set: {
            name: name,
            image: image,
          },
        }
      );

      if (updatedData.acknowledged) {
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


//get Delete category
export const getDeletecat = async (req, res) => {
    try {

        const categoryID = req.params.category_id;
        const categoryDatas = await categorysModel.findOne({ _id: categoryID });

        let image = categoryDatas.image; //oldname
  
 
          if (fs.existsSync("./uploads/" + categoryDatas.image)) {
            fs.unlinkSync("./uploads/" + categoryDatas.image);
          }


        const deletedData = await categorysModel.deleteOne({_id: categoryID});
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