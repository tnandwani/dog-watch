// APPWRITE TEST
import { Appwrite } from "appwrite";
import {appWriteID} from './constants'

// Init your Web SDK
const appwrite = new Appwrite();

appwrite
    .setEndpoint('http://localhost/v1') // Your Appwrite Endpoint
    .setProject(appWriteID) // Your project ID
;

 // Register User
export function createUser(){

    appwrite
    .account.create('memelord@example.com', 'password', 'plane Doe')
    .then(response => {
        console.log(response);
    }, error => {
        console.log(error);
    });
   

}
