const PUBLISH_ARTICLE = `
  mutation CreatePublication($input: CreateStoryInput!, $publicationId: String!) {
    createPublicationStory(input: $input, publicationId: $publicationId) {
        post {
            slug
            publication {
                domain
            }
            author {
                blogHandle
            }
        }
    }
  }
`;

export default PUBLISH_ARTICLE;
