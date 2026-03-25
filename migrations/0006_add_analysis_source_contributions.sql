-- Migration number: 0006 	 2026-03-25T16:44:25.000Z
CREATE TABLE IF NOT EXISTS analysis_source_contributions (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    analysis_id INTEGER NOT NULL,
    source_id INTEGER NOT NULL,
    signal_value REAL NOT NULL,
    weight_applied REAL NOT NULL,
    weighted_score REAL NOT NULL,
    raw_data TEXT NOT NULL DEFAULT '{}',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (analysis_id) REFERENCES betting_analyses(id) ON DELETE CASCADE,
    FOREIGN KEY (source_id) REFERENCES data_sources(id)
);
