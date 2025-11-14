import { gql } from 'graphql-tag';

export const typeDefs = gql`
  scalar DateTime

  type Repository {
    id: ID!
    owner: String!
    name: String!
    description: String
    url: String!
    lastSyncedAt: DateTime
    latestRelease: Release
    releases: [Release!]!
    hasUnseenRelease: Boolean!
  }

  type Release {
    id: ID!
    version: String!
    publishedAt: DateTime
    notes: String
    isSeen: Boolean!
    url: String
  }

  type User {
    id: ID!
    username: String!
    email: String
    avatarUrl: String
  }

  type Query {
    repositories: [Repository!]!
    repository(owner: String!, name: String!): Repository
    repositoryById(id: ID!): Repository
    me: User
  }

  type Mutation {
    addRepository(url: String!): Repository!
    markReleaseSeen(repositoryId: ID!, releaseId: ID!): Release!
    refreshRepository(id: ID!): Repository!
    refreshRepositories: [Repository!]!
    deleteRepository(id: ID!): Boolean!
  }
`;

