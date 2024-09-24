const router = require("express").Router();
router.get("/", async (req, res) => {
	console.log("Running");
	res.status(200).send("Route is running successfully!");
});

module.exports = router;