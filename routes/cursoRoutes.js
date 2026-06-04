const router = require('express').Router();
const ctrl = require('../controllers/cursoController');
const { autorizar } = require('../middlewares/auth');

router.get('/',    autorizar('superadmin', 'coordenador', 'aluno'), ctrl.getAll);
router.get('/:id', autorizar('superadmin', 'coordenador', 'aluno'), ctrl.getById);
router.post('/',   autorizar('superadmin'), ctrl.create);
router.put('/:id', autorizar('superadmin', 'coordenador'), ctrl.update);
router.delete('/:id', autorizar('superadmin', 'coordenador'), ctrl.remove);

module.exports = router;