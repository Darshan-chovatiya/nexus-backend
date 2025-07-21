const asyncHandler = require('express-async-handler');
const Category = require('../models/category');

// Create a new category
exports.createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ status: 400, message: 'Category name is required' });
  }

  const existingCategory = await Category.findOne({ name });
  if (existingCategory) {
    return res.status(400).json({ status: 400, message: 'Category already exists' });
  }

  const category = await Category.create({ name });
  return res.status(201).json({
    status: 201,
    message: 'Category created successfully',
    data: category,
  });
});

// Get all categories
exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  return res.status(200).json({
    status: 200,
    message: 'Categories fetched successfully',
    data: categories,
  });
});

// Update a category
exports.updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ status: 400, message: 'Category name is required' });
  }

  const category = await Category.findById(id);
  if (!category) {
    return res.status(404).json({ status: 404, message: 'Category not found' });
  }

  const existingCategory = await Category.findOne({ name, _id: { $ne: id } });
  if (existingCategory) {
    return res.status(400).json({ status: 400, message: 'Category name already exists' });
  }

  category.name = name;
  category.updatedAt = Date.now();
  await category.save();

  return res.status(200).json({
    status: 200,
    message: 'Category updated successfully',
    data: category,
  });
});

// Delete a category
exports.deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {
    return res.status(404).json({ status: 404, message: 'Category not found' });
  }

  await category.deleteOne();
  return res.status(200).json({
    status: 200,
    message: 'Category deleted successfully',
  });
});
