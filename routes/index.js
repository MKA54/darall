var express = require('express');
var router = express.Router();
var {PrismaClient} = require("@prisma/client");
var prisma = new PrismaClient();

function toObject(data) {
    return JSON.parse(JSON.stringify(data, (key, value) =>
        typeof value === 'bigint'
            ? value.toString()
            : value
    ));
}

router.get('/api/getMenu', async function (req, res) {
    var result = await prisma.menu.findMany();
    res.send(toObject(result));
});

router.post('/api/updateDish', async function (req, res) {
    var dish = req.body;

    await prisma.menu.update({
        where: {
            id: BigInt(dish.id),
        },
        data: {
            category: dish.category,
            name: dish.name,
            price: dish.price,
            weight: dish.weight
        }
    });

    res.send({
        success: true,
        message: null
    })
});

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index');
});

module.exports = router;