const { Router } = require("express");
const { drugsController } = require("../controllers/drugs.controller");

const router = Router();

router.post("/admin/drugs", drugsController.addDrug); //Добавление лекарства в БД -
router.delete("/admin/drugs/:drugId", drugsController.removeDrug); //Удаление лекарства из БД -
router.patch("/admin/drugs/:drugId", drugsController.editDrug); //Изменение лекарства в БД -

router.get("/clients/categories/:categoryId/drugs", drugsController.getDrugsByCategory); //Получение лекарств по категории
router.get("/drugs", drugsController.getDrugs); //Получение всех лекарств
router.get("/client/drugs/:drugId", drugsController.getDrugById); //Получение лекарства по ID

module.exports = router;