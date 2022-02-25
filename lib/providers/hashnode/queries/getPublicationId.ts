const GET_PUBLICATION_ID = `
  query PublicationId($username: String!) {
    user(username: $username) {
        publication {
            _id
        }    
    }
  }
`;

export default GET_PUBLICATION_ID;
