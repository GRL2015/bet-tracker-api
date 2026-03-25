-- Migration number: 0003 	 2026-03-25T16:44:25.000Z
CREATE TABLE IF NOT EXISTS social_media_picks (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    source_id INTEGER NOT NULL,
    platform TEXT NOT NULL,
    author_handle TEXT NOT NULL,
    content TEXT NOT NULL,
    pick_type TEXT NOT NULL,
    sport TEXT NOT NULL,
    event_description TEXT NOT NULL,
    predicted_outcome TEXT NOT NULL,
    confidence REAL NOT NULL DEFAULT 0.5,
    posted_at DATETIME NOT NULL,
    is_verified INTEGER NOT NULL DEFAULT 0,
    outcome_correct INTEGER,
    resolved_at DATETIME,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (source_id) REFERENCES data_sources(id)
);
