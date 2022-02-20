const GET_INFOS = `
  query PublicationId($username: String!) {
    user(username: $username) {
        numReactions
        numFollowers
        numPosts
    }
  }
`;

export default GET_INFOS;
