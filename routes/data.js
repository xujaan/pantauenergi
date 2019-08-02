var express = require('express')
var router = express.Router()
const data = require('../models/data')

router.get('/data/:opsi', (req, res, next) => {
    var opsi = req.params.opsi
    var awal = req.query.awal
    var akhir = req.query.akhir
    var spot = req.query.spot
    var tampil = req.query.tampil
    var query;
    if (opsi == 'real') {
        query = "select id, substr(waktu,12,8) as waktu, waktu as wak, tegangan, arus*100 as arus, daya/10 as daya, spot from data where spot = :spot order by wak desc limit 20"
    } else if (opsi == 'log') {
        switch (tampil) {
            case 'hari':
                query = "select date_format(waktu,'%a, %d %M %Y') as waktu, substr(waktu,1,10) as wak, sum(tegangan) as tegangan, sum(arus) as arus, sum(daya) as daya, spot from data where waktu >= :awal and waktu <= :akhir and spot = :spot group by week(waktu) order by wak desc"
                break
            case 'minggu':
                query = "select concat('Minggu ke ',week(waktu)) as waktu, waktu as wak, sum(tegangan) as tegangan, sum(arus) as arus, sum(daya) as daya, spot from data where waktu >= :awal and waktu <= :akhir and spot = :spot group by week(waktu) order by wak desc"
                break
            case 'bulan':
                query = "select date_format(waktu,'%M %Y') as waktu, substr(waktu,1,7) as wak, sum(tegangan) as tegangan, sum(arus) as arus, sum(daya) as daya, spot from data where waktu >= :awal and waktu <= :akhir and spot = :spot group by substr(waktu,6,2) order by wak desc"
                break
            case 'tahun':
                query = "select substr(waktu,1,4) as waktu, sum(tegangan) as tegangan, sum(arus) as arus, sum(daya) as daya, spot from data where waktu >= :awal and waktu <= :akhir and spot = :spot group by substr(waktu,1,4) order by waktu desc"
                break
            case '':
                query = "select date_format(waktu,'%a, %d %M %Y') as waktu, waktu as wak, tegangan, arus, daya, spot from data where waktu >= :awal and waktu <= :akhir and spot = :spot order by wak desc"
                break
        }
    }
    data.sequelize.query(query, {
        replacements: {
            awal: awal,
            akhir: akhir,
            spot: spot
        },
        type: data.sequelize.QueryTypes.SELECT
    }).then(data => {
        res.status(200)
        res.json({
            'status': 'success',
            'data': data,
            'message': null
        })
    }).catch(err => {
        res.json({
            'status': 'error',
            'data': null,
            'message': err
        })
    })
})
// module.exports = function (router, io) {
router.post('/data', (req, res, next) => {
    if (!req.body.tegangan) {
        res.status(400)
        res.send({
            'status': 'error',
            'data': null,
            'message': '400'
        })
    } else {
        data.create(req.body)
            .then(() => {
                var today = new Date();
                var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                var datasocket = {
                    // "waktu": new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
                    "waktu": time,
                    "tegangan": req.body.tegangan,
                    "arus": req.body.arus,
                    "daya": req.body.daya
                }
                // datasocket.push(req.body)
                // console.log(datasocket)
                req.app.io.emit('data', datasocket) //socketio
                res.send({
                    'status': 'success',
                    'data': null,
                    'message': 'add data'
                })
            })
            .catch(err => {
                res.send({
                    'status': 'error',
                    'data': null,
                    'message': err
                })
            })
    }
})
// }
router.delete('/data/:id', (req, res, next) => {
    data.destroy({
            where: {
                id: req.params.id
            }
        })
        .then(() => {
            res.send({
                'status': 'success',
                'data': null,
                'message': 'delete data'
            })
        })
        .catch(err => {
            res.send({
                'status': 'error',
                'data': null,
                'message': err
            })
        })
})

router.put('/data/:id', (req, res, next) => {
    if (!req.body.data_name) {
        res.status(400)
        res.send({
            'status': 'error',
            'data': null,
            'message': '400'
        })
    } else {
        data.update({
                data_name: req.body.data_name
            }, {
                where: {
                    id: req.params.id
                }
            })
            .then(() => {
                res.send({
                    'status': 'success',
                    'data': null,
                    'message': 'update data'
                })
            })
            .error(err => {
                res.send({
                    'status': 'error',
                    'data': null,
                    'message': handleError(err)
                })
            })
    }
})

module.exports = router