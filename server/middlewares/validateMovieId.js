const validateMovieId = (req, res, next) => {
  const { id } = req.params;

  const movieId = Number(id);

  if (!Number.isInteger(movieId) || movieId <= 0) {
    return res.status(400).json({
      message: "ID film harus berupa angka positif",
    });
  }

  next();
};

module.exports = validateMovieId;
