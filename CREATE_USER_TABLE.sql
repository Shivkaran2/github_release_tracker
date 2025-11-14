-- Run this SQL in your Supabase SQL Editor
-- This will create the User and UserRepository tables needed for authentication

-- Create User table
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL,
    "githubId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT,
    "avatarUrl" TEXT,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Create UserRepository table
CREATE TABLE IF NOT EXISTS "UserRepository" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "repositoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserRepository_pkey" PRIMARY KEY ("id")
);

-- Create indexes
CREATE UNIQUE INDEX IF NOT EXISTS "User_githubId_key" ON "User"("githubId");
CREATE INDEX IF NOT EXISTS "User_githubId_idx" ON "User"("githubId");
CREATE UNIQUE INDEX IF NOT EXISTS "UserRepository_userId_repositoryId_key" ON "UserRepository"("userId", "repositoryId");
CREATE INDEX IF NOT EXISTS "UserRepository_userId_idx" ON "UserRepository"("userId");
CREATE INDEX IF NOT EXISTS "UserRepository_repositoryId_idx" ON "UserRepository"("repositoryId");

-- Add foreign keys
ALTER TABLE "UserRepository" 
    ADD CONSTRAINT "UserRepository_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "UserRepository" 
    ADD CONSTRAINT "UserRepository_repositoryId_fkey" 
    FOREIGN KEY ("repositoryId") REFERENCES "Repository"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Update ReleaseSeen table to add foreign key to User
-- First, check if the foreign key already exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'ReleaseSeen_userId_fkey'
    ) THEN
        ALTER TABLE "ReleaseSeen" 
            ADD CONSTRAINT "ReleaseSeen_userId_fkey" 
            FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;


