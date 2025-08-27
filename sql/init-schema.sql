-- Initialize Heyes database schema with improvements
-- This script will be executed when PostgreSQL container starts

-- Create schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS heyes_schema;

-- Create sequences
CREATE SEQUENCE IF NOT EXISTS heyes_schema.users_user_id_seq;
CREATE SEQUENCE IF NOT EXISTS heyes_schema.teams_team_id_seq;
CREATE SEQUENCE IF NOT EXISTS heyes_schema.owners_owner_id_seq;
CREATE SEQUENCE IF NOT EXISTS heyes_schema.status_status_id_seq;
CREATE SEQUENCE IF NOT EXISTS heyes_schema.tasks_task_id_seq;

-- Create users table
CREATE TABLE IF NOT EXISTS heyes_schema.users (
  user_id integer NOT NULL DEFAULT nextval('heyes_schema.users_user_id_seq'::regclass),
  name character varying(100) NOT NULL,
  password character varying(255) NOT NULL, -- For hashed passwords
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT users_pkey PRIMARY KEY (user_id),
  CONSTRAINT users_name_unique UNIQUE (name),
  CONSTRAINT check_user_name_length CHECK (length(name) BETWEEN 2 AND 100)
);

-- Create teams table
CREATE TABLE IF NOT EXISTS heyes_schema.teams (
  team_id integer NOT NULL DEFAULT nextval('heyes_schema.teams_team_id_seq'::regclass),
  name character varying(100) NOT NULL,
  user_id integer NOT NULL,
  color character varying(7) NOT NULL DEFAULT '#797d7d',
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT teams_pkey PRIMARY KEY (team_id),
  CONSTRAINT fk_teams_user_id FOREIGN KEY (user_id) REFERENCES heyes_schema.users(user_id) ON DELETE CASCADE,
  CONSTRAINT unique_team_name_per_user UNIQUE (user_id, name),
  CONSTRAINT check_color_format CHECK (color ~ '^#[0-9A-Fa-f]{6}$'),
  CONSTRAINT check_team_name_length CHECK (length(name) BETWEEN 1 AND 100)
);

-- Create owners table
CREATE TABLE IF NOT EXISTS heyes_schema.owners (
  owner_id integer NOT NULL DEFAULT nextval('heyes_schema.owners_owner_id_seq'::regclass),
  name character varying(100) NOT NULL,
  user_id integer NOT NULL,
  team_id integer,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT owners_pkey PRIMARY KEY (owner_id),
  CONSTRAINT fk_owner_user_id FOREIGN KEY (user_id) REFERENCES heyes_schema.users(user_id) ON DELETE CASCADE,
  CONSTRAINT fk_owners_team_id FOREIGN KEY (team_id) REFERENCES heyes_schema.teams(team_id) ON DELETE SET NULL,
  CONSTRAINT unique_owner_name_per_user UNIQUE (user_id, name),
  CONSTRAINT check_owner_name_length CHECK (length(name) BETWEEN 1 AND 100)
);


-- Create status table
CREATE TABLE IF NOT EXISTS heyes_schema.status (
  status_id integer NOT NULL DEFAULT nextval('heyes_schema.status_status_id_seq'::regclass),
  status_type character varying(50) NOT NULL,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT status_pkey PRIMARY KEY (status_id),
  CONSTRAINT status_type_unique UNIQUE (status_type),
  CONSTRAINT check_status_type_length CHECK (length(status_type) BETWEEN 1 AND 50)
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS heyes_schema.tasks (
  task_id integer NOT NULL DEFAULT nextval('heyes_schema.tasks_task_id_seq'::regclass),
  title character varying(200) NOT NULL,
  description text,
  start_date date,
  end_date date,
  owner_id integer,
  user_id integer NOT NULL,
  status_id integer NOT NULL,
  priority character varying(10) DEFAULT 'medium',
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT tasks_pkey PRIMARY KEY (task_id),
  CONSTRAINT fk_tasks_owner_id FOREIGN KEY (owner_id) REFERENCES heyes_schema.owners(owner_id) ON DELETE SET NULL,
  CONSTRAINT fk_tasks_status FOREIGN KEY (status_id) REFERENCES heyes_schema.status(status_id),
  CONSTRAINT fk_tasks_user_id FOREIGN KEY (user_id) REFERENCES heyes_schema.users(user_id) ON DELETE CASCADE,
  CONSTRAINT check_task_dates CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date),
  CONSTRAINT check_task_title_length CHECK (length(title) BETWEEN 1 AND 200),
  CONSTRAINT check_priority CHECK (priority IN ('low', 'medium', 'high', 'urgent'))
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON heyes_schema.tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status_id ON heyes_schema.tasks(status_id);
CREATE INDEX IF NOT EXISTS idx_tasks_owner_id ON heyes_schema.tasks(owner_id);
CREATE INDEX IF NOT EXISTS idx_tasks_dates ON heyes_schema.tasks(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_owners_user_id ON heyes_schema.owners(user_id);
CREATE INDEX IF NOT EXISTS idx_owners_team_id ON heyes_schema.owners(team_id);
CREATE INDEX IF NOT EXISTS idx_teams_user_id ON heyes_schema.teams(user_id);
CREATE INDEX IF NOT EXISTS idx_owners_name ON heyes_schema.owners(name);

-- Insert default status values
INSERT INTO heyes_schema.status (status_type) VALUES 
  ('À faire'),
  ('En cours'),
  ('Terminé'),
  ('En attente')
ON CONFLICT (status_type) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION heyes_schema.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to auto-update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON heyes_schema.users 
    FOR EACH ROW EXECUTE FUNCTION heyes_schema.update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON heyes_schema.teams 
    FOR EACH ROW EXECUTE FUNCTION heyes_schema.update_updated_at_column();

CREATE TRIGGER update_owners_updated_at BEFORE UPDATE ON heyes_schema.owners 
    FOR EACH ROW EXECUTE FUNCTION heyes_schema.update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON heyes_schema.tasks 
    FOR EACH ROW EXECUTE FUNCTION heyes_schema.update_updated_at_column();