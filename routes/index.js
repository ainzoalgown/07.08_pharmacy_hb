const { Router } = require("express");
const express = require("express");

const router = Router();

router.use(express.urlencoded({extended: true}));
router.use(express.json());
router.use(require("./drugs.route"));
router.use(require("./clients.route"));
router.use(require("./categories.route"));

module.exports = router;