var express = require('express');
var router = express.Router();
var {PrismaClient} = require("@prisma/client");
var fs = require("fs");
var prisma = new PrismaClient();

router.post("/", async function (req, res) {
    var dishParameters = req.body;
    var filePath = req.files.file.path;

    if (!dishParameters) {
        res.send({
            success: false,
            message: "Неверный формат данных"
        });
    }

    if (!filePath) {
        res.send({
            success: false,
            message: "Файл не загружен"
        });
    }

    if (!dishParameters.category) {
        res.send({
            success: false,
            message: "Необходимо задать категорию блюда"
        });
    }

    if (!dishParameters.name) {
        res.send({
            success: false,
            message: "Необходимо задать название блюда"
        });
    }

    var regularExpression = /^[0-9]+$/;

    if (!regularExpression.test(dishParameters.price)) {
        res.send({
            success: false,
            message: "Цена введена некорректно"
        });
    }

    if (!regularExpression.test(dishParameters.weight)) {
        res.send({
            success: false,
            message: "Вес введен некорректно"
        });
    }

    if (!dishParameters.price) {
        res.send({
            success: false,
            message: "Необходимо задать цену блюда"
        });
    }

    if (!dishParameters.weight) {
        res.send({
            success: false,
            message: "Необходимо задать вес блюда"
        });
    }

    var tempName = filePath.split("\\").reverse()[0];
    var urlPreservationAndNameFile = '.\\public\\images\\' + tempName;

    fs.copyFile(filePath, urlPreservationAndNameFile, err => {
        if (err) {
            console.log('Файл не скопирован');
        } else {
            console.log('Файл успешно скопирован');
        }
    });

    var fileAccessPath = '.\\images\\' + tempName

    await prisma.menu.create({
        data: {
            category: dishParameters.category,
            name: dishParameters.name,
            price: dishParameters.price,
            weight: dishParameters.weight,
            image: fileAccessPath
        }
    });

    fs.unlink(filePath, err => {
        if (err) {
            console.log('Файл не скопирован');
        } else {
            console.log('Файл успешно скопирован');
        }
    });

    res.send({
        success: true,
        message: null
    })
});

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.render('dish');
});

module.exports = router;
