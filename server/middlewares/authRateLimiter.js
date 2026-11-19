const { Redis } = require("@upstash/redis");
const { Ratelimit } = require("@upstash/ratelimit");

// Redis menggunakan kredensial dari environment variables.
const redis = Redis.fromEnv();

const loginLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "15 m"),
  prefix: "chill:ratelimit:login",
});

const registerLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 h"),
  prefix: "chill:ratelimit:register",
});

const createRateLimitMiddleware = (limiter) => {
  return async (req, res, next) => {
    try {
      const ip = req.ip;

      if (!ip) {
        return res.status(400).json({
          message: "Alamat IP tidak tersedia",
        });
      }

      const result = await limiter.limit(ip);
      console.log("Rate limit IP:", ip);

      if (!result.success) {
        res.set(
          "Retry-After",
          String(Math.max(1, Math.ceil((result.reset - Date.now()) / 1000))),
        );

        return res.status(429).json({
          message: "Terlalu banyak percobaan. Silakan coba lagi nanti.",
        });
      }

      next();
    } catch (error) {
      console.error("Rate limiting gagal:", error);
      return res.status(503).json({
        message: "Layanan autentikasi sementara tidak tersedia",
      });
    }
  };
};

module.exports = {
  loginLimiter: createRateLimitMiddleware(loginLimiter),
  registerLimiter: createRateLimitMiddleware(registerLimiter),
};
