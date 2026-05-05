const router = require('express').Router();
const ctrl = require('../controllers/superAdminController');
const { autorizar } = require('../middlewares/auth');

router.get('/',                   autorizar('superadmin'),ctrl.getAll);
router.get('/usuario/:idUsuario', autorizar('superadmin'),ctrl.getByUsuario);
router.get('/:id',                autorizar('superadmin'), ctrl.getById);
router.post('/',                   ctrl.create);
router.put('/:id',                autorizar('superadmin'), ctrl.update);
router.delete('/:id',             autorizar('superadmin'), ctrl.remove);

module.exports = router;