const Category = require("../models/Category.model");

module.exports.categoriesController = {
  getCategories: async (req, res) => {
    try {
      const list = await Category.find().lean();
      res.render("layouts/main");
    } catch {
      res.json({ error: "Не удалось получить категории" });
    }
  },
  removeCategory: async (req, res) => {
    try {
      await Category.findByIdAndRemove(req.params.categoryId);
      res.send("Категория удалена");
    } catch {
      res.json({ error: "Не удалось удалить категорию" });
    }
  },
  addCategory: async (req, res) => {
    try {
      await Category.create({
        name: req.body.name
      })
      res.send("Категория успешно добавлена")
    } catch {
      res.json({ error: "Не удалось добавить категорию" });
    }
  }
}