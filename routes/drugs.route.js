const { Router } = require("express");
const { drugsController } = require("../controllers/drugs.controller");
const hasRoleMiddleware = require("../middlewaree/roleMiddlewaree");

const router = Router();

router.post("/drugs", hasRoleMiddleware(['ADMIN']),drugsController.addDrug); //Добавление лекарства в БД -
router.delete("/drugs/:drugId", hasRoleMiddleware(['ADMIN']), drugsController.removeDrug); //Удаление лекарства из БД -
router.patch("/drugs/:drugId", hasRoleMiddleware(['ADMIN']), drugsController.editDrug); //Изменение лекарства в БД -

router.get("/categories/:categoryId/drugs", drugsController.getDrugsByCategory); //Получение лекарств по категории
router.get("/drugs", hasRoleMiddleware(["CLIENT" || "ADMIN"]), drugsController.getDrugs); //Получение всех лекарств
router.get("/drugs/:drugId", drugsController.getDrugById); //Получение лекарства по ID

module.exports = router;