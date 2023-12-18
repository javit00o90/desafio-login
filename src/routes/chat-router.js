import express from 'express';
const router = express.Router();


const auth = (req, res, next) => {
    if (!req.session.user) {
        res.redirect('/login')
    } else {
        next();
    }
}

router.get('/',auth, async (req, res) => {
    res.render('chat', { session: req.session});
});

export default router;