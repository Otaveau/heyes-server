-- Migration: Add team_id column to owners table
-- This script adds team_id to owners and migrates data from owners_teams

-- Add team_id column to owners table
ALTER TABLE heyes_schema.owners 
ADD COLUMN team_id integer;

-- Add foreign key constraint
ALTER TABLE heyes_schema.owners 
ADD CONSTRAINT fk_owners_team_id 
FOREIGN KEY (team_id) REFERENCES heyes_schema.teams(team_id) ON DELETE SET NULL;

-- Migrate data from owners_teams to owners.team_id (take first team if multiple)
UPDATE heyes_schema.owners 
SET team_id = (
  SELECT ot.team_id 
  FROM heyes_schema.owners_teams ot 
  WHERE ot.owner_id = owners.owner_id 
  LIMIT 1
);

-- Drop the many-to-many table since we now have direct relation
DROP TABLE IF EXISTS heyes_schema.owners_teams;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_owners_team_id ON heyes_schema.owners(team_id);