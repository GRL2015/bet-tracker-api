-- Migration number: 0004 	 2026-03-25T16:44:25.000Z
CREATE TABLE IF NOT EXISTS source_accuracy_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    source_id INTEGER NOT NULL,
    prediction TEXT NOT NULL,
    actual_outcome TEXT NOT NULL,
    was_correct INTEGER NOT NULL,
    sport TEXT NOT NULL,
    event_description TEXT NOT NULL,
    logged_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (source_id) REFERENCES data_sources(id)
);
