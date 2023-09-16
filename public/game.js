const { Client, Account, Databases, ID, Query } = Appwrite;
const projectId = '65041f48f3669d07e15e';
const databaseId = '';
const collectionId = '';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject(projectId);

const account = new Account(client);

function register(event) {
  event.preventDefault();
  account
    .create(
      ID.unique(),
      event.target.elements['register-email'].value,
      event.target.elements['register-password'].value,
      event.target.elements['register-username'].value
    )
    .then((response) => {
      console.log(response);

      account.createEmailSession(
        event.target.elements['register-email'].value,
        event.target.elements['register-password'].value
      );
    })
    .catch((error) => console.error(error));
}
