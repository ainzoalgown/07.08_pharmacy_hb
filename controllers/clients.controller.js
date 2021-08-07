const Client = require("../models/Client.model");
const Cart = require("../models/Cart.model");
const Drug = require("../models/Drug.model");

module.exports.clientsController = {
  addClient: async (req, res) => {
    try {
      const newClient = await Client.create({ name: req.body.name }); //Создаётся новый клиент
      const newCart = await Cart.create({ toClient: newClient._id }); //К нему сразу создаётся корзина
      await Client.findOneAndUpdate(
        { name: req.body.name },
        { cartInfo: newCart._id }
      );
      res.send("Клиент успешно добавлен");
    } catch {
      res.json({ error: "Ошибка при добавлении клиента" });
    }
  },

  getClients: async (req, res) => {
    try {
      const data = await Client.find({}, "-__v").populate(
        "cartInfo products",
        "-__v -_id -toClient"
      );
      res.json(data);
    } catch {
      res.json({ error: "Ошибка при получении списка клиентов" });
    }
  },

  clearCart: async (req, res) => {
    try {
      await Cart.findOneAndUpdate(
        { toClient: req.params.clientId }, //Находит ID клиента
        { selectedMedicine: [], total_price: 0 }
      );
      res.send("Корзина очищена");
    } catch {
      res.json({ error: "Ошибка при очищении корзины" });
    }
  },

  topUpBalance: async (req, res) => {
    try {
      const client = await Client.findById(req.params.clientId);

      await Client.findByIdAndUpdate(req.params.clientId, {
        $set: { balance: client.balance + req.body.count },
      });
      res.send("Баланс успешно пополнен");
    } catch {
      res.json({ error: "Ошибка при пополнении счёта" });
    }
  },

  removeFromCart: async (req, res) => {
    try {
      const drug = await Drug.findById(req.params.drugId);
      const cart = await Cart.findOne({ toClient: req.params.clientId });

      await Cart.findOneAndUpdate(
        { toClient: req.params.clientId },
        { $pull: { selectedMedicine: req.params.drugId } }
      );
      await Cart.findOneAndUpdate(
        { toClient: req.params.clientId },
        { total_price: cart.total_price - drug.price }
      );
      res.send("Лекарство успешно убрано из корзины");
    } catch {
      res.json({ error: "Ошибка при удалении лекарства с корзины" });
    }
  },

  addToCart: async (req, res) => {
    try {
      const drug = await Drug.findById(req.params.drugId);
      const cart = await Cart.findOne({ toClient: req.params.clientId });

      await Cart.findOneAndUpdate(
        { toClient: req.params.clientId },
        { $push: { selectedMedicine: req.params.drugId } }
      );
      await Cart.findOneAndUpdate(
        { toClient: req.params.clientId },
        { total_price: cart.total_price + drug.price }
      );
      res.send("Лекарство успешно добавлено в корзину");
    } catch {
      res.json({ error: "Не получилось добавить лекарство в корзину" });
    }
  },

  buyAnOrder: async (req, res) => {
    try {
      const clientBalance = await Client.findById(req.params.clientId).balance;
      const total = await Cart.findOne({ toClient: req.params.clientId })
        .total_price;

      await Cart.findOneAndUpdate(
        { toClient: req.params.clientId },
        { selectedMedicine: [], total_price: 0 }
      );
      await Client.findByIdAndUpdate(req.params.clientId, {
        $set: { balance: clientBalance - total },
      });
      res.send("Заказ успешно оформлен");
    } catch {
      res.json({ error: "Не удалось оформить заказ" });
    }
  },
};
