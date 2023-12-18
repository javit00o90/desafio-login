import express from 'express';
const router = express.Router();
import { deleteProduct, addProduct } from '../utils/productOperations.js';

const auth = (req, res, next) => {
    if (!req.session.user) {
        res.redirect('/login')
    } else {
        next();
    }
}

router.get('/', auth, (req, res) => {
    res.render('realTimeProducts', { session: req.session});
});
router.delete('/:pid', deleteProduct);
router.post('/', addProduct);


export default router;
