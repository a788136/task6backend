const Slide = require('../models/Slide');

// Получить все слайды для презентации
exports.getSlidesByPresentation = async (req, res) => {
  try {
    const slides = await Slide.find({ presentationId: req.params.presentationId }).sort('order');
    res.json(slides);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Создать слайд
exports.createSlide = async (req, res) => {
  try {
    const { presentationId, order } = req.body;
    const slide = new Slide({ presentationId, order, blocks: [] });
    await slide.save();
    res.status(201).json(slide);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Обновить слайд (например, содержимое блоков)
exports.updateSlide = async (req, res) => {
  try {
    const slide = await Slide.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!slide) return res.status(404).json({ message: 'Slide not found' });
    res.json(slide);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Удалить слайд
exports.deleteSlide = async (req, res) => {
  try {
    const slide = await Slide.findByIdAndDelete(req.params.id);
    if (!slide) return res.status(404).json({ message: 'Slide not found' });
    res.json({ message: 'Slide deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
