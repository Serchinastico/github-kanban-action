interface Props {
  username: string;
  projectId: string;
}

export const getQuery = ({ username, projectId }: Props) => `
{
  user(login: "${username}") {
    projectV2 (number: ${projectId}) {
      title
      shortDescription
      field(name: "Status") {
        ... on ProjectV2SingleSelectField {
          name
          options {
            id
            name
          }
        }
      }
      items(first: 50) {
        nodes {
          content {
            __typename
            ... on DraftIssue {
              id
              title
            }
            ... on Issue {
              id
              title
              url
            }
          }
          fieldValueByName(name: "Status") {
            ... on ProjectV2ItemFieldSingleSelectValue {
              name
              field {
                ... on ProjectV2SingleSelectField {
                  name
                }
              }
            }
          }
          
          fieldValues(first: 50) {
            nodes {
              __typename
              ... on ProjectV2ItemFieldLabelValue {
                labels(first: 50) {
                  nodes {
                    color
                    name
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
`;
