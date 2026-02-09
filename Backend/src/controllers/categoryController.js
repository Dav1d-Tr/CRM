import * as CategoryService from "../services/categoryService.js";

export const getAllCategories = async (req, res) => {
  try {
    const { lineId } = req.query;

    if (lineId) {
      const categories = await CategoryService.getCategoriesByLine(lineId);
      return res.status(200).json(categories);
    }

    const categories = await CategoryService.getAllCategories();
    res.status(200).json(categories);

  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const category = await CategoryService.getCategoryById(categoryId);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(category);
  } catch (err) {
    console.error("Error fetching category:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createCategory = async (req, res) => {
  try {
    const categoryData = req.body;
    const newCategory = await CategoryService.createCategory(categoryData);
    res.status(200).json(newCategory);
  } catch (err) {
    console.error("Error creating category:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const categoryData = req.body;

    const updatedCategory = await CategoryService.updateCategory(
      categoryId,
      categoryData
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(updatedCategory);
  } catch (err) {
    console.error("Error updating category:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const deleted = await CategoryService.deleteCategory(categoryId);

    if (!deleted) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).send();
  } catch (err) {
    console.error("Error deleting category:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const searchCategory = async (req, res) => {
  try {
    const searchTerm = req.query.q;
    const categories = await CategoryService.searchCategory(searchTerm);
    res.status(200).json(categories);
  } catch (err) {
    console.error("Error al buscar una Categoria:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
