const Cart = require("../models/Cart.model");
const Drug = require("../models/Drug.model");
const User = require("../models/test-authorization/User.model"); //Моделька юзера
const Role = require("../models/test-authorization/Role.model"); //Моделька роли

const bcrypt = require("bcryptjs"); //библиотека для хэширования пароля
const { validationResult } = require("express-validator"); //Валидатор ошибок
const jwt = require("jsonwebtoken"); //Токен для авторизации

global.SECRET_KEY = "SECRET_KEY_RANDOM";
const generateAccessToken = (id, roles, balance=0, name, cartId) => { //Функция генерации токена. Передавать можно всё, что должно будет содержаться в токене
  const payload = { id, roles, balance, name, cartId }
  //Функция подключения токена, в опциях содержится время сгорания токена, секретный ключ = рандомный ключ
  return jwt.sign(payload, SECRET_KEY, {expiresIn: "24h"});
}

module.exports.clientsController = {
  registration: async (req, res) => { //Регистрация
    try {
      const errors = validationResult(req); //Проверка на содержание каких-либо ошибок (варианты ошибок указаны в роуте)
      if (!errors.isEmpty()) return res.status(400).json({message: "Ошибка при регистрации", errors})

      const {name, password} = req.body; //Достаём из req.body ключи [username, password]
      const candidate = await User.findOne({name}); //Проверка на наличие идентичного пользователя
      if (candidate) return res.status(404).json({message: `Пользователь под ником ${name} уже существует!`})

      const hashedPassword = bcrypt.hashSync(password, 7); //Создаём новый, захешированный пароль с помощью библиотеки bcrypt
      const userRole = await Role.findOne({value: "CLIENT"}); //Задаём изначальную роль при регистрации пользователя

        //Создаём нового пользователя ---> входные параметры: [username, password]
      const newUser = await User.create({ name, password: hashedPassword, roles: [userRole.value]}); //Роль создаётся та, что была определена двумя строчками раннее
      const newCart = await Cart.create({ toClient: newUser._id }); //К нему сразу создаётся корзина
      await User.findOneAndUpdate({ name: req.body.name }, { cartId: newCart._id });
      res.redirect("sign-in");

    } catch (e) {
      console.log(e);
      return res.status(400).json({message: "Registration error"})
    }
  },
  login: async (req, res) => { //Авторизация
    try {
      const { name, password } = req.body; //Достаём из req.body ключи [username, password]

      const user = await User.findOne({ name }) //Пробуем найти введёный ник в базе. Если он не найден,
      if (!user) return res.status(400).send(`Пользователь ${name} не найден`); //Выводится данное сообщение: {...}

      //Проверка валидности пароля. Т.к пароль у нас захеширован, то вызываем функцию проверки из самой библиотеки
      const validPassword = bcrypt.compareSync(password, user.password);
      if(!validPassword) res.status(400).send("Введён неверный пароль :9");

      const token = generateAccessToken(user._id, user.roles, user.balance, user.name, user.cartId); //Генерация токена по ранее созданной функции
      res.cookie("token", "Bearer " + token, {httpOnly: true, expires: new Date(Date.now() + 900000)});

      res.redirect("/drugs"); //Возвращение ответа в виде токена
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
  },
  authorizationPage: async (req, res) => {
    try {
      res.render("sign-in")
    } catch (e) {
      res.json(e)
    }
  },
  registrationPage: async (req, res) => {
    try {
      res.render("sign-up")
    } catch (e) {
      res.json(e)
    }
  },
  myProfile: async (req, res) => {
    try {
      const token = req.headers.cookie.slice(15);
      const data = jwt.decode(token);
      res.render("profile-with-cart", { data });
    } catch (e) {
      res.json(e);
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
