const router = require('express').Router();
const ctrl = require('../controllers/superAdminController');
//const { autorizar } = require('../middlewares/auth');

router.get('/',                    ctrl.getAll);
router.get('/usuario/:idUsuario',  ctrl.getByUsuario);
router.get('/:id',                 ctrl.getById);
router.post('/',                   ctrl.create);
router.put('/:id',                 ctrl.update);
router.delete('/:id',              ctrl.remove);

module.exports = router;