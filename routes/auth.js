var express = require('express');
var router = express.Router();
var {PrismaClient} = require("@prisma/client");
var prisma = new PrismaClient();
var crypto = require('crypto');

router.get('/login', function (req, res, next) {
    res.render('login');
});

var getHashedPassword = (password) => {
    var sha256 = crypto.createHash('sha256');
    return sha256.update(password).digest('base64');
}

router.post("/login", async function (req, res, next) {
    var email = req.body.email;
    var password = req.body.password;

    var hashedPassword = getHashedPassword(password);

    var user = await prisma.authorization.findFirst({
        where: {
            email: email,
            password: hashedPassword
        }
    })

    if (!user) {
        res.render('login', {
            message: 'Invalid username or password',
            messageClass: 'alert-danger'
        });
    }

    res.render('dish');
});

router.post("/register", async function (req, res) {
    var email = req.body.email;
    var password = req.body.password;
    var confirmPassword = req.body.confirmPassword;

    if (password === confirmPassword) {
        var user = await prisma.authorization.findFirst({
            where: {
                email
            }
        });

        if (user) {
            res.render('register', {
                message: 'User already registered.',
                messageClass: 'alert-danger'
            });

            return;
        }

        var hashedPassword = getHashedPassword(password);

        await prisma.authorization.create({
            data: {
                email: email,
                password: hashedPassword
            }
        });

        res.render('login', {
            message: 'Registration Complete. Please login to continue.',
            messageClass: 'alert-success'
        });
    } else {
        res.render('register', {
            message: 'Password does not match.',
            messageClass: 'alert-danger'
        });
    }
});

router.get('/auth', function (req, res, next) {
    res.render('auth');
});

router.get('/register', function (req, res, next) {
    res.render('register');
});

module.exports = router;