const express = require("express");
const { saveItem, getItems, getItemsForUsers, getOneItem, updateItem, deleteItem, markItemsUnavailable} = require("../controllers/itemsController");
const router = express.Router();
const upload = require("../middlewares/uploads");

// router.post('/saveItem', upload.single("file"), (req, res, next) => {
//   console.log("🔥 FILE RECEIVED:", req.file);
//   console.log("🔥 BODY RECEIVED:", req.body);
//   next();
// }, saveItem);

router.post('/saveItem', upload.single("file"), saveItem);
router.get('/getItems', getItems);
router.get('/getItemsForUsers', getItemsForUsers);
router.get("/getOneItem/:id", getOneItem);
router.put('/updateItem/:id', updateItem, upload.single("file"));
router.post("/catalog/markUnavailable", markItemsUnavailable);
router.delete('/deleteItem/:id', deleteItem);


// router.get("/", (req, res) => {
//   res.json({ message: "Catalog API is working!" });
// });


module.exports = router;