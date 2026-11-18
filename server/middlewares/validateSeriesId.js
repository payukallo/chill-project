const validateSeriesId = (req, res, next) => {
  const { id } = req.params;

  const seriesId = Number(id);

  if (!Number.isInteger(seriesId) || seriesId <= 0) {
    return res.status(400).json({
      message: "ID series harus berupa angka positif",
    });
  }

  next();
};

module.exports = validateSeriesId;
