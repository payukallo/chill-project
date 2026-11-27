const express = require("express");
const {
  createHash,
  timingSafeEqual
} = require("node:crypto");

const {
  scanOrphans
} = require("../services/r2CleanupService");

const {
  deleteEligibleObjects
} = require("../services/r2CleanupDeletionService");

const router = express.Router();

function hash(value) {
  return createHash("sha256")
    .update(value)
    .digest();
}

function authorized(req) {
  const secret = process.env.CRON_SECRET;

  if (!secret || secret.length < 32) {
    return false;
  }

  const authorization =
    req.get("Authorization") || "";

  return timingSafeEqual(
    hash(authorization),
    hash(`Bearer ${secret}`)
  );
}

router.get("/r2-cleanup", async (req, res) => {
  res.set("Cache-Control", "private, no-store");

  if (!authorized(req)) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized"
    });
  }

  const mode =
    process.env.R2_CLEANUP_MODE || "dry-run";

  if (!["dry-run", "observe", "delete"].includes(mode)) {
    return res.status(503).json({
      status: "error",
      message: "Invalid cleanup configuration"
    });
  }

  if (
    mode === "delete" &&
    process.env.R2_CLEANUP_DELETE_ENABLED !== "true"
  ) {
    return res.status(503).json({
      status: "error",
      message: "Deletion disabled"
    });
  }

  const started = Date.now();

  try {
    const scan = await scanOrphans({
      dryRun: mode === "dry-run"
    });

    const deletion =
      mode === "delete"
        ? await deleteEligibleObjects({
            dryRun: false
          })
        : null;

    const report = {
      mode,
      scan,
      deletion,
      durationMs: Date.now() - started
    };

    console.info(
      "[R2 Cleanup]",
      JSON.stringify(report)
    );

    return res.status(200).json({
      status: "success",
      data: report
    });

  } catch (error) {
    console.error(
      "[R2 Cleanup Failed]",
      error.name,
      error.code || ""
    );

    return res.status(500).json({
      status: "error",
      message: "Cleanup failed"
    });
  }
});

module.exports = router;
