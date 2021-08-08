const Drug = require("../models/Drug.model");
const { extname } = require("path");

module.exports.drugsController = {
  getDrugs: async (req, res) => {
    try {
      const list = await Drug.find().populate("category", "-_id");
      res.render(main, { list });
    } catch {
      res.json({  error: "Не удалось получить список лекарств"})
    }
  },
  getDrugsByCategory: async (req, res) => {
    try {
      const list = await Drug.find({ category: req.params.categoryId }).populate("category");
      res.json(list);
    } catch {
      res.json({  error: "Не удалось получить список лекарств"})
    }
  },
  getDrugById: async (req, res) => {
    try {
      const information = await Drug.findById(req.params.drugId).populate("category");
      res.json(information);
    } catch {
      res.json({  error: "Не удалось получить список лекарств"})
    }
  },

  addDrug: async (req, res) => {
    try {
      let image = req.body.image ? req.body.image : req.files.image; //Загрузка изображения по URL, либо из локального диска
      if (typeof image === 'object') {

        const imageFile = req.files.image;
        const ext = extname(imageFile.name);
        const newName = "/images/" + Math.random() + ext

        await imageFile.mv(`./public${newName}`);
        image = newName;
        //Может выскочить ошибка, если файл 'images' не создан
      }
      const { name, category, price, needPrescription } = req.body; //Извлекает конкретные ключи из req.body
      await Drug.create({ name, category, price, needPrescription, image}); //Ошибки могут возникать, если название ключа в модели не совпадает с названием передаваемой вами переменной

      res.send("Лекарство успешно добавлено в БД");
    } catch {
      res.json({  error: "Не удалось добавить лекарство в БД"})
    }
  },
  removeDrug: async (req, res) => {
    try {
      await Drug.findByIdAndRemove(req.params.drugId);
      res.send("Лекарство было удалено из БД")
    }
    catch {
      res.json({ error: "Не удалось получить список лекарств" })
    }
  },
  editDrug: async (req, res) => {
    try {
      await Drug.findByIdAndUpdate(req.params.drugId, req.body);
      res.send("Лекарство было успешно изменено");
    } catch {
      res.json({  error: "Не удалось получить список лекарств"})
    }
  },
}