const { Client, Account, Databases, ID, Query } = Appwrite;
const projectId = '65041f48f3669d07e15e';
const databaseId = '650935a1ce697466675c';
const collectionId = '650935b9502e2c261255';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject(projectId);

const account = new Account(client);
const database = new Databases(client);

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
      database.createDocument(databaseId, collectionId, response.$id, {
        userId: response.$id,
        highscore: 0,
      });

      account.createEmailSession(
        event.target.elements['register-email'].value,
        event.target.elements['register-password'].value
      );
    })
    .catch((error) => console.error(error));
}
