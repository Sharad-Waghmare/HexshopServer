import subCategoryModel from "../model/subcategory.model";
import fs from "fs";
import path from "path";
import multer from "multer";



const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        if (fs.existsSync("./uploads/subcategory")) {
            cb(null, "./uploads/subcategory");
        } else {
            fs.mkdirSync("./uploads/subcategory");
            cb(null, "./uploads/subcategory");
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


//get sub-category all
export const getSubcategory = async (req, res)=>{
    try {
        const subcatData = await subCategoryModel.aggregate([
            {
                $lookup:{
                    from:"categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "categories",
                },
            },
            {$unwind:"$categories"},
        ]);
        
        if(subcatData){
            return res.status(200).json({
                data: subcatData,
                message: "Success",
                path: "http://localhost:8001/uploads/subcategory"
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
};


//get add sub-category
export const getAddsubcategory = (req, res) => {
    try {
        const uploadDatacat = upload.single("image");
        uploadDatacat(req, res, function(err){
            if(err) return res.status(400).json({message: err.message});

            const { name, category } = req.body;

            let image = null;
            if (req.file !== undefined) {
                image = req.file.filename;
            }

            const createdDatacat = new subCategoryModel({
                name: name,
                category: category,
                image: image

            });

            createdDatacat.save();

            if(createdDatacat){
                return res.status(201).json({
                    data: createdDatacat,
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


//get single sub-category
export const getSinglesubcat = async (req, res)=>{
    try {
        const subcatId = req.params.subcategory_id;

        const subcatData = await subCategoryModel.findOne({_id: subcatId});
        if(subcatData){
            return res.status(200).json({
                data: subcatData,
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
export const getUpdatesubcategory = async (req, res)=>{
    try {
        
        const uploadDatasub = upload.single("image");
    uploadDatasub(req, res, async function (err) {
      if (err) return res.status(400).json({ message: err.message });
      const subcateID = req.params.subcategory_id;

      
      const { name, category } = req.body;

      const subcategoryData = await subCategoryModel.findOne({ _id: subcateID });

      let image = subcategoryData.image; //oldname

      if (req.file !== undefined) {
        image = req.file.filename;
        if (fs.existsSync("./uploads/" + subcategoryData.image)) {
          fs.unlinkSync("./uploads/" + subcategoryData.image);
        }
      }
      const updatedDatasub = await subCategoryModel.updateOne(
        { _id: subcateID },
        {
          $set: {
            name: name,
            category: category,
            image: image,
          },
        }
      );

      if (updatedDatasub.acknowledged) {
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
export const getDeletesubcat = async (req, res) => {
    try {

        const subID = req.params.subcategory_id;
        const subData = await subCategoryModel.findOne({ _id: subID });

        let image = subData.image; //oldname
  
 
          if (fs.existsSync("./uploads/" + subData.image)) {
            fs.unlinkSync("./uploads/" + subData.image);
          }


        const deletedDatasub = await subCategoryModel.deleteOne({_id: subID});
        if(deletedDatasub.acknowledged){
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