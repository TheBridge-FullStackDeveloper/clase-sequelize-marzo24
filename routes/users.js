const express = require("express");
const UserController = require("../controllers/UserController");
const router = express.Router();

router.post("/", UserController.create);
router.get("/", UserController.getAll);
router.delete("/id/:id", UserController.delete);
router.put("/id/:id",UserController.update)

module.exports = router;
