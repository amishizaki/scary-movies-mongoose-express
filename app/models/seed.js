const mongoose = require('mongoose')
const ScaryMovie = require('./scary_movie')
const db = require('../../config/db')

const startScaryMovies = [
    {title: 'The Thing', director: 'John Carpenter', year: '1982' },
    {title: 'Nope', director: 'Jordan Peele', year: '2022' },
    {title: '28 Days Later', director: 'Danny Boyle', year: '2002' },
    {title: 'Scream', director: 'Wes Craven', year: '1996' },
    {title: 'Alien', director: 'Ridley Scott', year: '1979' },
    {title: 'Jaws', director: 'Stephen Spielberg', year: '1975' },
    {title: 'Barbarian', director: 'Zach Cregger', year: '2022' },
    {title: 'The Shining', director: 'Stanley Kubrick', year: '1980' },
    {title: 'Carrie', director: 'Brian De Palma', year: '1976' },
    {title: 'The VVitch', director: 'Robert Eggers', year: '2015' },
    {title: 'The Babadook', director: 'Jennifer Kent', year: '2014' }
]

mongoose.connect(db, {
    useNewUrlParser: true
})
    .then(() => {
        ScaryMovie.deleteMany({ owner: null })
            .then(deletedScaryMovies => {
                console.log('the deleted', deletedScaryMovies)

                ScaryMovie.create(startScaryMovies)
                    .then(newScaryMovies => {
                        console.log('the new', newScaryMovies)
                        mongoose.connection.close()
                    })
                    .catch(error => {
                        console.log(error)
                        mongoose.connection.close()
                    })
            })
            .catch(error => {
                console.log(error)
                mongoose.connection.close()
            })
    })
    .catch(error => {
        console.log(error)
        mongoose.connection.close()
    })