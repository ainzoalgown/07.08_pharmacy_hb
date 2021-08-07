const { Router } = require("express");
const { clientsController } = require("../controllers/clients.controller");

const router = Router();

router.get("/clients", clientsController.getClients); //Получение списка клиентов
router.post("/clients", clientsController.addClient); //Добавление клиента

router.patch("/clients/:clientId/drugs/:drugId", clientsController.addToCart); //Добавить лекарство в корзину
router.patch("/clients/:clientId/cart/:drugId", clientsController.removeFromCart); //Убрать из корзины лекарство

router.patch("/clients/:clientId", clientsController.topUpBalance) //Пополнить баланс
router.patch("/clients/:clientId/cart", clientsController.clearCart); //Очистить корзину
router.patch("/clients/:clientId/cart/order", clientsController.buyAnOrder); //Оформить заказ(должны сняться деньги с счёта клиента и очиститься товар в корзине

module.exports = router;