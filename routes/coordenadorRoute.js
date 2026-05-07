const router = require('express').Router();
const ctrl = require('../controllers/coordenadorController');
const { autorizar, apenasProprioCoordenador } = require('../middlewares/auth');

router.get('/',    autorizar('superadmin'), ctrl.getAll);
router.get('/:id', autorizar('superadmin'), ctrl.getById);
router.post('/',   autorizar('superadmin'), ctrl.create);
router.put('/:id', autorizar('superadmin'), ctrl.update);
router.delete('/:id', autorizar('superadmin'), ctrl.remove);


router.get('/:id/cursos',             apenasProprioCoordenador, ctrl.getCursos);
router.post('/:id/cursos',            autorizar('superadmin'), ctrl.addCurso);
router.delete('/:id/cursos/:idCurso', autorizar('superadmin'), ctrl.removeCurso);

module.exports = router;