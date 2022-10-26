// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for examples
const ScaryMovie = require('../models/scary_movie')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { example: { title: '', text: 'foo' } } -> { example: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// Index
// /scary-movies
router.get('/scary-movies', requireToken, (req, res, next) => {
    ScaryMovie.find()
        .then(scaryMovies => {
            return scaryMovies.map(scaryMovie => scaryMovie)
        })
        .then(scaryMovies =>  {
            res.status(200).json({ scaryMovies: scaryMovies })
        })
        .catch(next)
})

//Show
// /scary-movies/:id
router.get('/scary-movies/:id', requireToken, (req, res, next) => {
    ScaryMovie.findById(req.params.id)
    .then(handle404)
    .then(scaryMovie => {
        res.status(200).json({ scaryMovie: scaryMovie })
    })
    .catch(next)

})

// Create
// /Scary Movie
router.post('/scary-movies', requireToken, (req, res, next) => {
    req.body.scaryMovie.owner = req.user.id

    // on the front end I HAVE TO SEND a scary movie as the top level key
    // scaryMovies: {name: '', type:''} 
    ScaryMovie.create(req.body.scaryMovie)
    .then(scaryMovie => {
        res.status(201).json({ scaryMovie: scaryMovie })
    })
    .catch(next)
    // .catch(error => next(error)) long hand for above
})

// update
// patch
// /scary-movies/:id
router.patch('/scary-movies/:id', requireToken, removeBlanks, (req, res, next) => {
    delete req.body.scaryMovie.owner

    ScaryMovie.findById(req.params.id)
    .then(handle404)
    .then(scaryMovie => {
        requireOwnership(req, scaryMovie)

        return scaryMovie.updateOne(req.body.scaryMovie)
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

// DESTROY
// DELETE /scary-movies/5a7db6c74d55bc51bdf39793
router.delete('/scary-movies/:id', requireToken, (req, res, next) => {
	ScaryMovie.findById(req.params.id)
		.then(handle404)
		.then((scaryMovie) => {
			requireOwnership(req, scaryMovie)
			scaryMovie.deleteOne()
		})
		.then(() => res.sendStatus(204))
		.catch(next)
})

module.exports = router
