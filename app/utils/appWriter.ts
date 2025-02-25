import { Client, Storage } from "appwrite";
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject('67665bb500071a8a4514');

export const appWriterStorage = new Storage(client);

export default client;
