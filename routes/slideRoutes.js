const express = require('express');
const router = express.Router();
const slideController = require('../controllers/slideController');

// Получить все слайды по id презентации
router.get('/presentation/:presentationId', slideController.getSlidesByPresentation);

// Создать новый слайд
router.post('/', slideController.createSlide);

// Обновить слайд
router.put('/:id', slideController.updateSlide);

// Удалить слайд
router.delete('/:id', slideController.deleteSlide);

module.exports = router;
