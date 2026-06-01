const express = require('express');
const { listMovies, getMovieBySlug } = require('../controllers/movieController');

const router = express.Router();

router.get('/', listMovies);
router.get('/:slug', getMovieBySlug);

module.exports = router;
