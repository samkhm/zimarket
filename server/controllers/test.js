const Store = require("../models/ItemStore");
const path = require("path");
const cloudinary = require("cloudinary").v2;

exports.saveItem = async (req, res) => {
    try {

        const { name, price, size } = req.body;

        if(!name || !price || !size) {
            return res.status(400).json({ message : "All details required"})
        };

        if(!req.file || !req.file.path){
            return res.status(400).json({ message : "Image is required!"});
        }
       
        const imageUrl = req.file.path;

        const itemExist = await Store.findOne({ name, price, size });
        if(itemExist) return res.status(401).json({ message : "Item already available"});

            
        const savedItems = await Store.create({ name : name, image : imageUrl, price : price, size : size });
        res.status(201).json({ message : "Saved!"}, savedItems);
        
    } catch (error) {
        res.json({ error : "Server failed to save Items"});
        console.log("Server failed to save item : ", error);        
    }
}

exports.getItems = async (req, res) =>{
    try {
        const catalog = await Store.find();
        if(!catalog) return res.status(404).json({ message : "No items"});

        res.json(catalog);
        
    } catch (error) {
        res.json({ error : "Server failed to get Items"});
        console.log("Server failed to get item : ", error);
        
    }
}

exports.updateItem = async (req, res) => {
    try {
        const catalogItem = await Store.findById(req.params.id);
        if(!catalogItem){
            return res.status(404).json({ message : "Item not found"});
        }

        const updateData = {};
        if(req.body.name) updateData.name = req.params.name.trim();
        if(req.body.price) updateData.price = req.params.price.trim();
        if(req.body.size) updateData.size = req.params.size.trim();

        if(req.file){
            if(catalogItem.image && catalogItem.image.includes("cloudinary.com")){
                const publicId = catalogItem.image.split("/").pop().split(".")[0];
                try {
                    await cloudinary.uploader.destroy(publicId);
                } catch (error) {
                    console.warn("Failed to delete old cloudinary Image: ", error.message);                    
                }
            }

            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "zimark_folder"
            });

            updateData.image = result.secure_url;
        }

        const updatedCatalog = await Store.findById(
            req.params.id,
            updateData,
            { new : true, runValidators : true}
        );

        if(!updatedCatalog){
            return res.status(404).json({ message : "Project not found"});
        }
        
        res.json({ message : "Updated successfully"}, updatedCatalog);
    } catch (error) {
        res.json({ error : "Server failed to update Item"});
        console.log("Server failed to Update Item : ", error);
        
    }
}

exports.deleteItem = async (req, res) => {
    try {
        const delItem = await Store.findById(req.params.id);
        if(!delItem) return res.status(404).json({ message : "Item not available"});

        await Store.findByIdAndDelete(req.params.id);

        if(delItem.imageFile){
            const filePath = path.join(__dirname, "../uploads", delItem.imageFile);
            fs.unlink(filePath, (err) => {
                if(err){
                    console.error("Error deleting file:", err.message);
                }
            })
        }
        res.json({ message : "Item deleted"});
        
    } catch (error) {
        res.json({ error : "Server failed to delete Item"});
        console.log("Server failed to delete item : ", error);        
    }
}