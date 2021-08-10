const { Router } = require("express");
const { clientsController } = require("../controllers/clients.controller");
const { usersController } = require("../controllers/clients.controller");
const { check } = require("express-validator");
const authMiddlewaree = require("../middlewaree/authMiddlewaree");
const hasRoleMiddleware = require("../middlewaree/roleMiddlewaree");

const router = Router();

router.get("/auth/sign-in", clientsController.authorizationPage);
router.get("/auth/sign-up", clientsController.registrationPage);
router.post("/auth/sign-up", [
 check("name", "Имя пользователя не может быть пустым").notEmpty(),
 check("password", "Пароль должен быть больше 4 и меньше 10 символов").isLength({ min: 4, max: 10 })
], clientsController.registration);
router.post("/auth/sign-in", clientsController.login); //Исследуем новые функции
router.get("/users", hasRoleMiddleware(['ADMIN']), clientsController.getUsers);

//====================================================================================\\
router.get("/my-profile", clientsController.myProfile);
router.patch("/clients/:clientId/drugs/:drugId", hasRoleMiddleware(['CLIENT']), clientsController.addToCart); //Добавить лекарство в корзину
router.patch("/clients/:clientId/cart/:drugId", hasRoleMiddleware(['CLIENT']), clientsController.removeFromCart); //Убрать из корзины лекарство

router.patch("/clients/:clientId", hasRoleMiddleware(['CLIENT']),clientsController.topUpBalance); //Пополнить баланс
router.patch("/clients/:clientId/cart", hasRoleMiddleware(['CLIENT']),clientsController.clearCart); //Очистить корзину
router.patch("/clients/:clientId/cart/order", hasRoleMiddleware(['CLIENT']),clientsController.buyAnOrder); //Оформить заказ(должны сняться деньги с счёта клиента и очиститься товар в корзине

module.exports = router;
