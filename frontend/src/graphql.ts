import { gql } from '@apollo/client';

export const REPOSITORIES_QUERY = gql`
  query Repositories {
    repositories {
      id
      owner
      name
      description
      url
      lastSyncedAt
      hasUnseenRelease
      releases {
        id
        version
        publishedAt
        notes
        isSeen
        url
      }
    }
  }
`;

export const ADD_REPOSITORY_MUTATION = gql`
  mutation AddRepository($url: String!) {
    addRepository(url: $url) {
      id
      owner
      name
      description
      url
      lastSyncedAt
      hasUnseenRelease
      releases {
        id
        version
        publishedAt
        notes
        isSeen
        url
      }
    }
  }
`;

export const MARK_RELEASE_SEEN_MUTATION = gql`
  mutation MarkReleaseSeen($repositoryId: ID!, $releaseId: ID!) {
    markReleaseSeen(repositoryId: $repositoryId, releaseId: $releaseId) {
      id
      version
      isSeen
    }
  }
`;

export const REFRESH_REPOSITORIES_MUTATION = gql`
  mutation RefreshRepositories {
    refreshRepositories {
      id
      owner
      name
      description
      url
      lastSyncedAt
      hasUnseenRelease
      releases {
        id
        version
        publishedAt
        notes
        isSeen
        url
      }
    }
  }
`;

export const DELETE_REPOSITORY_MUTATION = gql`
  mutation DeleteRepository($id: ID!) {
    deleteRepository(id: $id)
  }
`;

export const ME_QUERY = gql`
  query Me {
    me {
      id
      username
      email
      avatarUrl
    }
  }
`;



