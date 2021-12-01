// APPWRITE TEST
import {
    Appwrite
} from "appwrite";
import {
    appWriteID
} from './constants'

// Init your Web SDK
const appwrite = new Appwrite();
appwrite
    .setEndpoint('http://localhost/v1') // Your Appwrite Endpoint
    .setProject(appWriteID) // Your project ID
;

// Register User
export function createUser(email, pass) {

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

export async function uploadImage(profileImage) {

    // create binary blob file 
    const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            resolve(xhr.response);
        };
        xhr.onerror = function (e) {
            console.log(e);
            reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", profileImage, true);
        xhr.send(null);
    });

    //push to AW
    let promise = appwrite.storage.createFile(blob);

    promise.then(function (response) {
        console.log(response); // Success
    }, function (error) {
        console.log(error); // Failure
    });
}
