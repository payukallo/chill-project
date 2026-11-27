CREATE TABLE IF NOT EXISTS r2_cleanup_lock (
    id TINYINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

INSERT IGNORE INTO r2_cleanup_lock (id) VALUES (1);

CREATE TABLE IF NOT EXISTS r2_cleanup_candidates (
    bucket VARCHAR(63) NOT NULL,
    object_key VARCHAR(512) NOT NULL,
    object_etag VARCHAR(255) NOT NULL,
    size_bytes BIGINT UNSIGNED NOT NULL,
    first_seen_at DATETIME(3) NOT NULL,
    last_seen_at DATETIME(3) NOT NULL,
    status ENUM(
        'pending',
        'deleting',
        'deleted',
        'protected'
    ) NOT NULL DEFAULT 'pending',
    deleted_at DATETIME(3) NULL,
    PRIMARY KEY (bucket, object_key),
    KEY idx_cleanup_status_age (status, first_seen_at)
) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
