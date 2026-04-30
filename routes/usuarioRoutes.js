const router = require('express').Router();
const ctrl = require('../controllers/usuarioController');
const { autorizar, apenasProprioUsuario } = require('../middlewares/auth');

router.get('/',    autorizar('superadmin'), ctrl.getAll);
router.get('/:id', autorizar('superadmin'), ctrl.getById);
router.post('/',   autorizar('superadmin'), ctrl.create);
router.put('/:id', autorizar('superadmin'), ctrl.update);
router.delete('/:id', autorizar('superadmin'), ctrl.remove);


router.put('/:id/senha', apenasProprioUsuario, ctrl.updateSenha);

module.exports = router;