import { Client, Storage } from "appwrite";
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("67c689ce0034cd9c46a0");

export const appWriterStorage = new Storage(client);

export default client;
