const router = require('express').Router();
const ctrl = require('../controllers/atividadeController');
const { autorizar, apenasProprioAluno } = require('../middlewares/auth');

router.get('/aluno/:matricula', apenasProprioAluno,                        ctrl.getByAluno);

router.get('/',    autorizar('superadmin', 'coordenador'),                 ctrl.getAll);
router.get('/:id', autorizar('superadmin', 'coordenador'),                 ctrl.getById);

router.post('/',   autorizar('superadmin', 'coordenador', 'aluno'),        ctrl.create);
router.put('/:id', autorizar('superadmin', 'coordenador'),                 ctrl.update);
router.delete('/:id', autorizar('superadmin', 'coordenador', 'aluno'),     ctrl.remove);

module.exports = router;