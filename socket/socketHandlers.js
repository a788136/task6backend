const mongoose = require('mongoose');
const Slide = require('../models/Slide');
const Presentation = require('../models/Presentation');

module.exports = (io) => {
  const onlineUsers = {};

  io.on('connection', (socket) => {

    // ====== Присоединение к презентации ======
    socket.on('join-presentation', async ({ presentationId, nickname }) => {
      socket.join(presentationId);
      socket.presentationId = presentationId;
      socket.nickname = nickname;

      let pres = await Presentation.findById(presentationId);
      if (!pres) return;
      if (!Array.isArray(pres.users)) pres.users = [];
      let user = pres.users.find(u => u.nickname === nickname);
      if (!user) {
        const role = pres.creatorNickname === nickname ? "editor" : "viewer";
        pres.users.push({ nickname, role });
        await pres.save();
      }

      if (!onlineUsers[presentationId]) onlineUsers[presentationId] = new Set();
      onlineUsers[presentationId].add(nickname);

      const users = pres.users.map(u => ({
        nickname: u.nickname,
        role: u.role,
        online: onlineUsers[presentationId].has(u.nickname)
      }));
      io.to(presentationId).emit('users-list', users);
    });

    // ====== Смена роли пользователя (только создатель!) ======
    socket.on('change-role', async ({ presentationId, nickname, newRole }) => {
      let pres = await Presentation.findById(presentationId);
      if (!pres) return;
      if (socket.nickname !== pres.creatorNickname) return;

      let user = pres.users.find(u => u.nickname === nickname);
      if (user) {
        user.role = newRole;
        await pres.save();

        const users = pres.users.map(u => ({
          nickname: u.nickname,
          role: u.role,
          online: onlineUsers[presentationId]?.has(u.nickname) || false
        }));
        io.to(presentationId).emit('users-list', users);
        io.to(presentationId).emit('role-changed', { nickname, newRole });
      }
    });

    // ====== Добавить слайд ======
    socket.on('add-slide', async ({ presentationId, order }) => {
      const slide = new Slide({ presentationId, order, blocks: [] });
      await slide.save();
      io.to(presentationId).emit('slide-added', slide);
    });

    // ====== Удалить слайд ======
    socket.on('delete-slide', async ({ slideId, presentationId }) => {
      await Slide.findByIdAndDelete(slideId);
      io.to(presentationId).emit('slide-deleted', { slideId });
    });

    // ====== Обновить блок ======
    socket.on('update-block', async ({ slideId, block }) => {
      try {
        const slide = await Slide.findById(slideId);
        if (!slide) return;

        // === Исправляем проблему с _id ===
        let blockToSave = { ...block };
        // Если _id невалидный или отсутствует, создаём новый ObjectId
        if (!blockToSave._id || !mongoose.isValidObjectId(blockToSave._id)) {
          blockToSave._id = new mongoose.Types.ObjectId();
        }

        // Обновить или добавить блок
        const blockIdx = slide.blocks.findIndex(
          b => b._id && b._id.toString() === blockToSave._id.toString()
        );
        if (blockIdx >= 0) {
          slide.blocks[blockIdx] = blockToSave;
        } else {
          slide.blocks.push(blockToSave);
        }
        await slide.save();
        socket.to(slide.presentationId.toString()).emit('block-updated', { slideId, block: blockToSave });
      } catch (err) {
        console.error('update-block error:', err);
      }
    });

    // ====== Отключение пользователя ======
    socket.on('disconnect', async () => {
      const { presentationId, nickname } = socket;
      if (!presentationId || !nickname) return;
      if (onlineUsers[presentationId]) {
        onlineUsers[presentationId].delete(nickname);

        let pres = await Presentation.findById(presentationId);
        if (pres) {
          const users = pres.users.map(u => ({
            nickname: u.nickname,
            role: u.role,
            online: onlineUsers[presentationId].has(u.nickname)
          }));
          io.to(presentationId).emit('users-list', users);
        }
      }
    });
  });
};
