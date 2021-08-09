const { Router } = require("express");
const { clientsController } = require("../controllers/clients.controller");
const { usersController } = require("../controllers/clients.controller");
const { check } = require("express-validator");
const authMiddlewaree = require("../middlewaree/authMiddlewaree");
const hasRoleMiddlewaree = require("../middlewaree/roleMiddlewaree");

const router = Router();

router.post("/auth/registration", [
 check("username", "Имя пользователя не может быть пустым").notEmpty(),
 check("password", "Пароль должен быть больше 4 и меньше 10 символов").isLength({ min: 4, max: 10 })
], usersController.registration);
router.post("/auth/login", usersController.login); //Исследуем новые функции
router.get("/users", hasRoleMiddlewaree(['USER']), usersController.getUsers);

//====================================================================================\\
router.get("/clients", clientsController.getClients); //Получение списка клиентов
router.post("/clients", clientsController.addClient); //Добавление клиента

router.patch("/clients/:clientId/drugs/:drugId", clientsController.addToCart); //Добавить лекарство в корзину
router.patch(
  "/clients/:clientId/cart/:drugId",
  clientsController.removeFromCart
); //Убрать из корзины лекарство

router.patch("/clients/:clientId", clientsController.topUpBalance); //Пополнить баланс
router.patch("/clients/:clientId/cart", clientsController.clearCart); //Очистить корзину
router.patch("/clients/:clientId/cart/order", clientsController.buyAnOrder); //Оформить заказ(должны сняться деньги с счёта клиента и очиститься товар в корзине

module.exports = router;
