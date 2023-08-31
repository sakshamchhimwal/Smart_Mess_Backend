//Purpose : user API routes

import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
    console.log("hi");
    res.send("User API");
});

export default router;