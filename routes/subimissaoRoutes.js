const router = require('express').Router();
const ctrl = require('../controllers/submissaoController');
const { autorizar } = require('../middlewares/auth');

router.get('/',                           autorizar('superadmin', 'coordenador'), ctrl.getAll);
router.get('/coordenador/:idCoordenador', autorizar('superadmin', 'coordenador'), ctrl.getByCoordenador);
router.get('/atividade/:idAtividade',     autorizar('superadmin', 'coordenador'), ctrl.getByAtividade);
router.get('/:id',                        autorizar('superadmin', 'coordenador'), ctrl.getById);


router.post('/', autorizar('superadmin', 'coordenador', 'aluno'), ctrl.create);


router.put('/:id/status', autorizar('superadmin', 'coordenador'), ctrl.updateStatus);
router.delete('/:id',     autorizar('superadmin'), ctrl.remove);

module.exports = router