const router = require('express').Router();
const ctrl = require('../controllers/dashboardController');
const { autorizar } = require('../middlewares/auth');

router.get('/',      autorizar('superadmin', 'coordenador'), ctrl.getDashboard);
router.get('/aluno', autorizar('aluno'),                     ctrl.getDashboardAluno);

module.exports = router;