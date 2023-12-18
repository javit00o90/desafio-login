import express from 'express';
import { usersModel } from '../dao/models/users.model.js';
import crypto from 'crypto';

const router = express.Router();

router.post('/login', async (req, res) => {
    let { email, password } = req.body;

    if (!email || !password) {
        return res.redirect('/login?error=All fields are required');
    }

    password = crypto.createHmac("sha256", "javicoder9090").update(password).digest("hex");

    if (email === 'adminCoder@coder.com' && password === crypto.createHmac("sha256", "javicoder9090").update('adminCod3r123').digest("hex")) {
        const adminUser = {
            first_name: 'Admin',
            last_name: 'Coder',
            email: 'adminCoder@coder.com',
            role: 'admin'
        };

        req.session.user = adminUser;
        return res.redirect('/products?message=Admin account logged in');
    }

    let user = await usersModel.findOne({ email, password });

    if (!user) {
        return res.redirect(`/login?error=Name or password incorrect`);
    }

    const { first_name, last_name, email: userEmail, age, role } = user;

    req.session.user = {
        first_name,
        last_name,
        email: userEmail,
        age,
        role,
    };

    res.redirect('/products?message=You logged in correctly');
});


router.post('/register', async (req, res) => {
    let { first_name, last_name, age, email, password } = req.body;

    if (!first_name || !last_name || !age || !email || !password) {
        return res.redirect('/register?error=All fields are required');
    }

    let exist = await usersModel.findOne({ email });

    if (exist) {
        return res.redirect(`/register?error=User with ${email} already exist`);
    }

    password = crypto.createHmac("sha256", "javicoder9090").update(password).digest("hex");

    try {
        await usersModel.create({ first_name, last_name, age, email, password });
        res.redirect(`/login?message=User ${email} created successfully!`);
    } catch (error) {
        res.redirect('/register?error=Unexpected error. Try again in a few minutes');
    }
});

router.get('/logout', (req, res) => {

    req.session.destroy(error => {
        if (error) {
            res.redirect('/login?error=Logout failed')
        }
    })

    res.redirect('/login')

});



export default router;