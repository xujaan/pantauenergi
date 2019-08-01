var express = require('express')
var router = express.Router()
const spot = require('../models/spot')

router.get('/spot', (req, res, next) => {
    spot.findAll()
        .then(spot => {
            res.status(200)
            res.json({
                'status': 'success',
                'data': spot,
                'message': null
            })
        })
        .catch(err => {
            res.json({
                'status': 'error',
                'data': null,
                'message': err
            })
        })
})

router.post('/spot', (req, res, next) => {
    if (!req.body.spot_name) {
        res.status(400)
        res.json({
            'status': 'error',
            'data': null,
            'message': '400'
        })
    } else {
        spot.create(req.body)
            .then(() => {
                res.json({
                    'status': 'success',
                    'data': null,
                    'message': 'add data'
                })
            })
            .catch(err => {
                res.json({
                    'status': 'error',
                    'data': null,
                    'message': err
                })
            })
    }
})

router.delete('/spot/:id', (req, res, next) => {
    spot.destroy({
            where: {
                id: req.params.id
            }
        })
        .then(() => {
            res.json({
                'status': 'success',
                'data': null,
                'message': 'delete data'
            })
        })
        .catch(err => {
            res.json({
                'status': 'error',
                'data': null,
                'message': err
            })
        })
})

router.put('/spot/:id', (req, res, next) => {
    if (!req.body.spot_name) {
        res.status(400)
        res.json({
            'status': 'error',
            'data': null,
            'message': '400'
        })
    } else {
        spot.update({
                spot_name: req.body.spot_name
            }, {
                where: {
                    id: req.params.id
                }
            })
            .then(() => {
                res.json({
                    'status': 'success',
                    'data': null,
                    'message': 'update data'
                })
            })
            .error(err => {
                res.json({
                    'status': 'error',
                    'data': null,
                    'message': handleError(err)
                })
            })
    }
})

module.exports = router