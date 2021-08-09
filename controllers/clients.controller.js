const Client = require("../models/Client.model");
const Cart = require("../models/Cart.model");
const Drug = require("../models/Drug.model");

const User = require("../models/test-authorization/User.model"); //Моделька юзера
const Role = require("../models/test-authorization/Role.model"); //Моделька роли
const bcrypt = require("bcryptjs"); //библиотека для хэширования пароля
const { validationResult } = require("express-validator"); //Валидатор ошибок
const jwt = require("jsonwebtoken"); //Токен для авторизации

global.SECRET_KEY = "SECRET_KEY_RANDOM";
const generateAccessToken = (id, roles) => { //Функция генерации токена. Передавать можно всё, что должно будет содержаться в токене
  const payload = { id, roles }
  //Функция подключения токена, в опциях содержится время сгорания токена, секретный ключ = рандомный ключ
  return jwt.sign(payload, SECRET_KEY, {expiresIn: "24h"});
}

module.exports.usersController = {
  registration: async (req, res) => { //Регистрация
    try {
      const errors = validationResult(req); //Проверка на содержание каких-либо ошибок (варианты ошибок указаны в роуте)
      if (!errors.isEmpty()) res.status(400).json({message: "Ошибка при регистрации", errors})

      const {username, password} = req.body; //Достаём из req.body ключи [username, password]
      const candidate = await User.findOne({username}); //Проверка на наличие идентичного пользователя
      if (candidate) res.status(404).json({message: `Пользователь под ником ${username} уже существует!`})

      const hashedPassword = bcrypt.hashSync(password, 7); //Создаём новый, захешированный пароль с помощью библиотеки bcrypt
      const userRole = await Role.findOne({value: "USER"}); //Задаём изначальную роль при регистрации пользователя
        //Создаём нового пользователя ---> входные параметры: [username, password]
      await User.create({username, password: hashedPassword, roles: [userRole.value]}); //Роль создаётся та, что была определена двумя строчками раннее
      res.send("Пользователь успешно создан");
    } catch (e) {
      console.log(e);
      res.status(400).json({message: "Registration error"})
    }
  },
  login: async (req, res) => { //Авторизация
    try {
      const { username, password } = req.body; //Достаём из req.body ключи [username, password]

      const user = await User.findOne({ username }) //Пробуем найти введёный ник в базе. Если он не найден,
      if (!user) res.status(400).send(`Пользователь ${username} не найден`); //Выводится данное сообщение: {...}

      //Проверка валидности пароля. Т.к пароль у нас захеширован, то вызываем функцию проверки из самой библиотеки
      const validPassword = bcrypt.compareSync(password, user.password);
      if(!validPassword) res.status(400).send("Введён неверный пароль :9");

      const token = generateAccessToken(user._id, user.roles); //Генерация токена по ранее созданной функции
      req.headers.authorization = `Bearer ${token}`;
      return res.json({token}); //Возвращение ответа в виде токена
    } catch (e) {
      console.log(e);
      res.status(400).json({message: "Login error"})
    }
  },
  getUsers: async (req, res) => { //Получения списка всех юзеров
    try {
      const users = await User.find();
      res.json(users);
    } catch (e) {
      res.json(e);
    }
  }
}

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
