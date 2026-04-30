const router = require('express').Router();
const ctrl = require('../controllers/alunoController');
const { autorizar, apenasProprioAluno } = require('../middlewares/auth');

router.get('/',    autorizar('superadmin', 'coordenador'), ctrl.getAll);
router.post('/',   autorizar('superadmin'), ctrl.create);
router.put('/:matricula',    autorizar('superadmin', 'coordenador'), ctrl.update);
router.delete('/:matricula', autorizar('superadmin', 'coordenador'), ctrl.remove);


router.get('/:matricula', apenasProprioAluno, ctrl.getById);


router.get('/:matricula/cursos',             apenasProprioAluno, ctrl.getCursos);
router.post('/:matricula/cursos',            autorizar('superadmin'), ctrl.addCurso);
router.delete('/:matricula/cursos/:idCurso', autorizar('superadmin'), ctrl.removeCurso);

module.exports = router;