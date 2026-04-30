const router = require('express').Router();
const ctrl = require('../controllers/notificacaoController');
const { autorizar } = require('../middlewares/auth');

router.get('/',                       autorizar('superadmin', 'coordenador'), ctrl.getAll);
router.get('/submissao/:idSubmissao', autorizar('superadmin', 'coordenador'), ctrl.getBySubmissao);
router.get('/destinatario/:email',    autorizar('superadmin', 'coordenador'), ctrl.getByDestinatario);
router.get('/:id',                    autorizar('superadmin', 'coordenador'), ctrl.getById);
router.post('/',                      autorizar('superadmin', 'coordenador'), ctrl.create);
router.delete('/:id',                 autorizar('superadmin'), ctrl.remove);

module.exports = router;