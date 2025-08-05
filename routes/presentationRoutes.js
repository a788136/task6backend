// const express = require('express');
// const router = express.Router();
// const presentationController = require('../controllers/presentationController');
// const Presentation = require('../models/Presentation');

// // Все презентации с превью слайда
// router.get('/', presentationController.getPresentations);

// // Создать презентацию
// router.post('/', presentationController.createPresentation);

// // Одна презентация + все слайды
// router.get('/:id', presentationController.getPresentationWithSlides);

// // Переименование презентации (PUT), удаление и т.д. — как было
// router.put('/:id', async (req, res) => {
//   try {
//     const { title } = req.body;
//     const presentation = await Presentation.findByIdAndUpdate(
//       req.params.id,
//       { title },
//       { new: true }
//     );
//     if (!presentation) return res.status(404).json({ error: "Not found" });
//     res.json(presentation);
//   } catch (err) {
//     res.status(500).json({ error: "Ошибка сервера" });
//   }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const presentationController = require('../controllers/presentationController');
const Presentation = require('../models/Presentation');

// Все презентации с превью слайда
router.get('/', presentationController.getPresentations);

// Создать презентацию
router.post('/', presentationController.createPresentation);

// Одна презентация + все слайды
router.get('/:id', presentationController.getPresentationWithSlides);

// Переименование презентации (PUT)
router.put('/:id', async (req, res) => {
  try {
    const { title } = req.body;
    const presentation = await Presentation.findByIdAndUpdate(
      req.params.id,
      { title },
      { new: true }
    );
    if (!presentation) return res.status(404).json({ error: "Not found" });
    res.json(presentation);
  } catch (err) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// === ВОТ ЭТО ДОБАВЬ ===
router.delete('/:id', presentationController.deletePresentation);

module.exports = router;
