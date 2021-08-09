const express = require("express");
const mongoose = require("mongoose");
const hbs = require("express-handlebars");
const fileUpload = require("express-fileupload");

const app = express();
const port = 5000;

app.use(fileUpload());
app.use(require("./routes/index.js"));

app.use(express.static('public'));
app.engine('.hbs', hbs({ extname: ".hbs"}));
app.set("view engine", '.hbs');

mongoose.connect("mongodb+srv://code:code@cluster0.cnyps.mongodb.net/pharmacy_handlebars?retryWrites=true&w=majority", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
})
.then( () => app.listen(port, () => console.log("Сервер успешно запущен")));

//БЭК ДЛЯ АПТЕКИ
//
// В БД ДОЛЖНЫ ФИГУРИРОВАТЬ ЛЕКАРСТВА, КАТЕГОРИИ ЛЕКАРСТВ, КОРЗИНА, АДМИНИСТРАТОР И КЛИЕНТ.
//
//
// Функционал админа:
//
//  - все CRUD операции с аптеками
//  - все CRUD операции с категориями
//
// Функционал клиента:
//
//  - просматривать все лекарства +
//  - просматривать все лекарства по определенной категории +
//  - просматривать определенное лекарство +
//  - добавлять определенное лекарство в корзину +
//  - удалять лекарство из корзины +
//  - очищать корзину +
//  - покупать товар из корзины (корзина должна очиститься) +
//  - пополнять свой кошелек +
//
//
// Дополнение:
//
//  - у пользователя должен быть ключ в котором содержится сумма на его счету.
//  - когда пользователеь покупает товар из корзины, сумма на его счету должна уменьшиться на общую сумму товаров из коризны
//  - у лекарства должен быть ключ обозначающий продается ли оно без рецепта или нет, если нет, то пользователь может добавить его в корзину, только при наличии рецепта
