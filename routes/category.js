const express = require('express');
const router = express.Router();
const { createCategory, getCategories, updateCategory, deleteCategory } = require('../controllers/category');
const { superAdminAuthToken } = require('../middlewares/authenticator');

router.post('/categories', superAdminAuthToken, createCategory);
router.get('/categories', getCategories); // No auth required for fetching categories in signup
router.put('/categories/:id', superAdminAuthToken, updateCategory);
router.delete('/categories/:id', superAdminAuthToken, deleteCategory);

module.exports = router;