-- Cloudflare D1 資料庫結構綱要 (schema.sql)
-- 執行方式: npx wrangler d1 execute tool-notebook-db --file=./worker/schema.sql

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  display_name TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS spaces (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  layout TEXT DEFAULT 'grid',
  invite_code TEXT UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tools (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  space_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  content TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  col_span INTEGER DEFAULT 1,
  deleted_at DATETIME DEFAULT NULL,
  created_by_user_id INTEGER DEFAULT NULL,
  updated_by_user_id INTEGER DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (space_id) REFERENCES spaces(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS space_members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  space_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  role TEXT DEFAULT 'editor',
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(space_id, user_id),
  FOREIGN KEY (space_id) REFERENCES spaces(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS hosted_shares (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  share_code TEXT UNIQUE NOT NULL,
  user_id INTEGER NOT NULL,
  space_id INTEGER NOT NULL,
  mode TEXT NOT NULL, -- 'single' | 'multi'
  tool_ids TEXT NOT NULL, -- JSON array
  title TEXT NOT NULL,
  custom_config TEXT DEFAULT '{}',
  is_active INTEGER DEFAULT 1,
  views INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (space_id) REFERENCES spaces(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS space_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  space_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (space_id) REFERENCES spaces(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS space_activities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  space_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  action TEXT NOT NULL,
  details TEXT DEFAULT '',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (space_id) REFERENCES spaces(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_spaces_invite_code ON spaces(invite_code);
CREATE INDEX IF NOT EXISTS idx_spaces_user_id ON spaces(user_id);
CREATE INDEX IF NOT EXISTS idx_tools_space_id ON tools(space_id);
CREATE INDEX IF NOT EXISTS idx_tools_deleted_at ON tools(deleted_at);
CREATE INDEX IF NOT EXISTS idx_space_members_user_id ON space_members(user_id);
CREATE INDEX IF NOT EXISTS idx_hosted_shares_code ON hosted_shares(share_code);
CREATE INDEX IF NOT EXISTS idx_space_messages_space ON space_messages(space_id);
CREATE INDEX IF NOT EXISTS idx_space_activities_space ON space_activities(space_id);
