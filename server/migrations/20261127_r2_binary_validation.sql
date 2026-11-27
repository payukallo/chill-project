CREATE TABLE IF NOT EXISTS r2_verified_uploads (
    bucket VARCHAR(63) NOT NULL,
    object_key VARCHAR(512) NOT NULL,
    object_etag VARCHAR(255) NOT NULL,
    size_bytes BIGINT UNSIGNED NOT NULL,
    content_type VARCHAR(100) NOT NULL,
    validation_version SMALLINT UNSIGNED NOT NULL,
    verified_at DATETIME(3) NOT NULL
        DEFAULT CURRENT_TIMESTAMP(3),
    PRIMARY KEY (bucket, object_key)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
