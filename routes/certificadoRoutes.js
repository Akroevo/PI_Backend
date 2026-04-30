const router = require('express').Router();
const ctrl = require('../controllers/certificadoController');
const { autorizar } = require('../middlewares/auth');

router.get('/',                       autorizar('superadmin', 'coordenador'), ctrl.getAll);
router.get('/:id',                    autorizar('superadmin', 'coordenador'), ctrl.getById);
router.get('/submissao/:idSubmissao', autorizar('superadmin', 'coordenador', 'aluno'), ctrl.getBySubmissao);


router.post('/',   autorizar('superadmin', 'coordenador', 'aluno'), ctrl.create);
router.put('/:id', autorizar('superadmin', 'coordenador'), ctrl.update);
router.delete('/:id', autorizar('superadmin'), ctrl.remove);

module.exports = router;