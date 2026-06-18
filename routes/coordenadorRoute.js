const router = require('express').Router();
const ctrl = require('../controllers/coordenadorController');
const alunoCtrl = require('../controllers/alunoController');
const { autorizar, apenasProprioCoordenador } = require('../middlewares/auth');

router.get('/',    autorizar('superadmin'), ctrl.getAll);
router.get('/:id', autorizar('superadmin', 'coordenador'), ctrl.getById);
router.post('/',   autorizar('superadmin'), ctrl.create);
router.put('/:id', autorizar('superadmin'), ctrl.update);
router.delete('/:id', autorizar('superadmin'), ctrl.remove);

router.put('/:id/submissoes/:idSubmissao/avaliar', autorizar('coordenador'), apenasProprioCoordenador, ctrl.avaliarSubmissao);

router.get('/:id/cursos',              autorizar('superadmin', 'coordenador'), ctrl.getCursos);
router.post('/:id/cursos',             autorizar('superadmin'), ctrl.addCurso);
router.delete('/:id/cursos/:idCurso',  autorizar('superadmin'), ctrl.removeCurso);

router.get('/:id/alunos', autorizar('superadmin', 'coordenador'), alunoCtrl.getAlunosByCoordenador);

module.exports = router;