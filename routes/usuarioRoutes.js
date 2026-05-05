const router = require('express').Router();
const ctrl = require('../controllers/usuarioController');
//const { autorizar, apenasProprioUsuario } = require('../middlewares/auth');

router.get('/',     ctrl.getAll);
router.get('/:id',  ctrl.getById);
router.post('/',    ctrl.create);
router.put('/:id',  ctrl.update);
router.delete('/:id', ctrl.remove);


//router.put('/:id/senha', apenasProprioUsuario, ctrl.updateSenha);

module.exports = router;