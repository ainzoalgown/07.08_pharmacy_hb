const { Router } = require("express");
const { categoriesController } = require("../controllers/categories.controller");

const router = Router();

router.get("/", categoriesController.getCategories); //Получить список категорий
router.delete("admin/categories/:categoryId", categoriesController.removeCategory); //Удалить категорию
router.post("admin/categories", categoriesController.addCategory); //Добавить категорию

module.exports = router;