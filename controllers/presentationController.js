const Presentation = require('../models/Presentation');
const Slide = require('../models/Slide');

// Получить все презентации с превью первого слайда
exports.getPresentations = async (req, res) => {
  try {
    const presentations = await Presentation.find();

    // Для каждой презентации находим первый слайд
    const presentationsWithPreview = await Promise.all(
      presentations.map(async (p) => {
        const firstSlide = await Slide.findOne({ presentationId: p._id }).sort('order');
        let firstSlideText = "";
        if (firstSlide && Array.isArray(firstSlide.blocks) && firstSlide.blocks.length > 0) {
          // Предпочтение — если есть блок с текстом
          const textBlock = firstSlide.blocks.find(b => b.type === 'text' && b.content);
          firstSlideText = textBlock ? textBlock.content : "";
        }
        // Вернем все данные + превью
        return {
          ...p.toObject(),
          firstSlideText,
        };
      })
    );

    res.json(presentationsWithPreview);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Создать презентацию (старое не трогаем)
exports.createPresentation = async (req, res) => {
  try {
    const { title, creatorNickname } = req.body;
    const presentation = new Presentation({ title, creatorNickname });
    await presentation.save();
    res.status(201).json(presentation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Получить одну презентацию + все её слайды (старое не трогаем)
exports.getPresentationWithSlides = async (req, res) => {
  try {
    const presentation = await Presentation.findById(req.params.id);
    if (!presentation) return res.status(404).json({ message: 'Presentation not found' });

    const slides = await Slide.find({ presentationId: presentation._id }).sort('order');

    res.json({
      presentation,
      slides
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Удалить презентацию и все её слайды
exports.deletePresentation = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Presentation.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Not found" });

    // Удаляем все слайды, связанные с этой презентацией
    await Slide.deleteMany({ presentationId: id });

    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: "Ошибка удаления" });
  }
};
