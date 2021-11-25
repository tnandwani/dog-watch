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
export function createUser(email, pass){
    
    let promise = appwrite.account.create(email, pass);

    promise.then(function (response) {
        const r = response.message
        console.log(r); // Success
        return r
    }, function (error) {
        const e = error.message
        console.log(e); // Failure
        return e


    });
   

}
