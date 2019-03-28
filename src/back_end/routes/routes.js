const express = require("express");
const router = express.Router();

router.get("/online", (req, res) => {
    res.send(true);
})

module.exports = router;