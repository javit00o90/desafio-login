import express from 'express';
const router = express.Router();
import { getProducts } from '../utils/productOperations.js';

const auth = (req, res, next) => {
    if (!req.session.user) {
        res.redirect('/login')
    } else {
        next();
    }
}

router.get('/', auth, async (req, res) => {
    try {
        let {message}=req.query
        const productsData = await getProducts(req);
        res.render('products', { session: req.session, productsData, message });
    } catch (error) {
        console.error('Error retrieving products:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;