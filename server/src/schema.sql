CREATE TABLE IF NOT EXISTS "users" (
	"username" text PRIMARY KEY,
	"kdf" text,
    "snapshot_version" int,
    "snapshot_content" text,
    "snapshot_sequence" int,
    "actions" text[]
);