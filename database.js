// APPWRITE 
import {
    Appwrite
} from "appwrite";
import {
    appWriteID
} from './constants'

// init db
const appwrite = new Appwrite();
appwrite
    .setEndpoint('http://localhost/v1') // Your Appwrite Endpoint
    .setProject(appWriteID) // Your project ID
;


////////// USER FUNCTIONS 

export async function getAccount(){
    let promise = appwrite.account.get();

    promise.then(function (response) {
      console.log(response); // Success
      return true
    }, function (error) {
      console.log(error); // Failure
      return false
    });

}

export function signOutUser() {
    let promise = appwrite.account.deleteSessions();

    promise.then(function (response) {
        console.log(response); // Success

    }, function (error) {
        console.log(error); // Failure
    });
}

export function signInUser(email, password, uid) {
    let promise = appwrite.account.createSession(email, password);

    promise.then(function (response) {
        console.log(response); // Success
        // Create User Doc
        createUserDoc(uid, email);

    }, function (error) {
        console.log(error); // Failure
    });
}

export function createUserAccount(email, password) {

    // Create User
    let promise = appwrite.account.create(email, password);
    promise.then(function (response) {
        console.log("created");
        console.log(response); // Success
        // Get UID 
        const uid = response.$id


        // Sign In
        signInUser(email, password, uid)

    }, function (error) {
        console.log(error); // Failure
    });
}



export function createUserDoc(uid, email) {

    console.log("Getting ready to create user")
    console.log(uid);

    // push data to db 

    appwrite.database.createDocument('619f011dd6cc2', {
        uid: uid,
        email: email,
        zone: false
    }).
    then(function (response) {
        console.log("doc made");
        console.log(response); // Success

        // push doc-id as user name
        const userDocID = response.$id;
        updateUserName(userDocID);

    }, function (error) {
        console.log(error); // Failure
    });

}

export function updateUserName(userDocID) {

    // sign in user


    // update name

    let promise = appwrite.account.updateName(userDocID);

    promise.then(function (response) {
        console.log("updated name");
        console.log(response); // Success
    }, function (error) {
        console.log(error); // Failure
    });

}








////////// DOG FUNCTIONS 

export async function uploadImage(imageURI) {


    console.log("in uploader");
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
        xhr.open("GET", imageURI, true);
        xhr.send(null);
    });

    //push to AW
    let promise = appwrite.storage.createFile(blob);

    promise.then(function (response) {

        const photoID = response.$id
        console.log("response is"); // Success
        console.log(photoID); // avatar URL


    }, function (error) {
        console.log(error); // Failure
        return (error.message)
    });
}
