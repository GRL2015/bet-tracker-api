-- Migration number: 0005 	 2026-03-25T16:44:25.000Z
CREATE TABLE IF NOT EXISTS betting_analyses (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    sport TEXT NOT NULL,
    event_description TEXT NOT NULL,
    event_date DATETIME NOT NULL,
    final_score REAL NOT NULL,
    recommendation TEXT NOT NULL,
    confidence REAL NOT NULL,
    contributing_sources_count INTEGER NOT NULL DEFAULT 0,
    breakdown TEXT NOT NULL DEFAULT '{}',
    notes TEXT NOT NULL DEFAULT '',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
