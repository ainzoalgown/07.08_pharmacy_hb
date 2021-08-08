const Drug = require("../models/Drug.model");

module.exports.drugsController = {
  getDrugs: async (req, res) => {
    try {
      const list = await Drug.find({}, "-__v").populate("category", "-__v -_id");
      res.render(main, { list });
    } catch {
      res.json({  error: "Не удалось получить список лекарств"})
    }
  },
  getDrugsByCategory: async (req, res) => {
    try {
      const list = await Drug.find({  category: req.params.categoryId }, "-__v").populate("category", "-__v -_id");
      res.json(list);
    } catch {
      res.json({  error: "Не удалось получить список лекарств"})
    }
  },
  getDrugById: async (req, res) => {
    try {
      const information = await Drug.findById(req.params.drugId, "-__v").populate("category", "-_id -__v");
      res.json(information);
    } catch {
      res.json({  error: "Не удалось получить список лекарств"})
    }
  },

  addDrug: async (req, res) => {
    try {
      await Drug.create({
        name: req.body.name,
        category: req.body.category,
        price: req.body.price,
        needPrescription: req.body.needPrescription
      })
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