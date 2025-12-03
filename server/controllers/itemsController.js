const Store = require("../models/ItemStore");
const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

// ======================= SAVE ITEM ==========================
exports.saveItem = async (req, res) => {
    try {
        const { name, price, size } = req.body;

        if (!name || !price || !size) {
            return res.status(400).json({ message: "All details required" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Image is required!" });
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "zimark_folder",
        });

        const itemExist = await Store.findOne({ name, price, size });
        if (itemExist) {
            return res.status(400).json({ message: "Item already available" });
        }

        const savedItem = await Store.create({
            name,
            price,
            size,
            image: result.secure_url,
        });

        return res.status(201).json({
            message: "Saved",
            savedItem,
        });
    } catch (error) {
        console.error("Server failed to save item:", error);
        return res.status(500).json({ error: "Server failed to save item" });
    }
};

// ======================= GET ITEMS ==========================
exports.getItems = async (req, res) => {
    try {
        // Only return items that are not deleted
        const catalog = await Store.find({ deleted: false }).sort({ createdAt: -1 });

        if (!catalog || catalog.length === 0) {
            return res.status(404).json({ message: "No items available" });
            
        }

        return res.json(catalog);
    } catch (error) {
        // console.error("Server failed to get items:", error);
        return res.status(500).json({ error: "Server failed to get items" });
    }
};

// get users items
exports.getItemsForUsers = async (req, res) => {
    try {
        // Only return items that are not deleted
        const catalog = await Store.find({ deleted: false, available : true }).sort({ createdAt: -1 });

        if (!catalog || catalog.length === 0) {
            return res.status(404).json({ message: "No items available" });
            
        }

        return res.json(catalog);
    } catch (error) {
        console.error("Server failed to get items:", error);
        return res.status(500).json({ error: "Server failed to get items" });
    }
};


exports.getOneItem = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await Store.findById(id);

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        return res.json(item);

    } catch (error) {
        console.error("Failed to get item:", error);
        return res.status(500).json({ error: "Failed to get item" });
    }
};


// ======================= UPDATE ITEM ==========================
exports.updateItem = async (req, res) => {
    try {
        const item = await Store.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        const updateData = {};

        if (req.body.name) updateData.name = req.body.name.trim();
        if (req.body.price) updateData.price = req.body.price;
        if (req.body.size) updateData.size = req.body.size.trim();

        // Replace image
        if (req.file) {
            if (item.image && item.image.includes("cloudinary.com")) {
                const publicId = item.image.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(publicId);
            }

            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "zimark_folder",
            });

            updateData.image = result.secure_url;
        }

        const updatedItem = await Store.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        return res.json({
            message: "Updated successfully",
            updatedItem,
        });
    } catch (error) {
        console.error("Server failed to update item:", error);
        return res.status(500).json({ error: "Server failed to update item" });
    }
};

//mark item unavailbe
exports.markItemsUnavailable = async (req, res) => {
    try {
      const { itemIds } = req.body;
  
      if (!itemIds || !Array.isArray(itemIds)) {
        return res.status(400).json({ message: "itemIds array is required" });
      }
  
      await Store.updateMany(
        { _id: { $in: itemIds } },
        { $set: { available: false } }
      );
  
      res.json({ message: "Items marked unavailable" });
    } catch (error) {
      console.error("Failed to mark items unavailable:", error);
      res.status(500).json({ error: "Failed to update items" });
    }
  };
  





// ======================= DELETE ITEM ==========================
exports.deleteItem = async (req, res) => {
    try {
        const item = await Store.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: "Item not available" });
        }

        // Optional: delete image from Cloudinary
        if (item.image && item.image.includes("cloudinary.com")) {
            const publicId = item.image.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(publicId);
        }

        // Soft delete
        item.deleted = true;
        await item.save();

        return res.json({ message: "Item deleted successfully" });
    } catch (error) {
        console.error("Server failed to delete item:", error);
        return res.status(500).json({ error: "Server failed to delete item" });
    }
};

