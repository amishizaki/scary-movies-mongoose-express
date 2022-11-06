const mongoose = require('mongoose')

const scaryMovieSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		director: {
			type: String,
			required: true,
		},
        year: {
			type: String,
			required: true,
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: false,
		},
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model('ScaryMovie', scaryMovieSchema)