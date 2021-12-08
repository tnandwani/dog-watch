// APPWRITE 
import {
    Appwrite
} from "appwrite";
import {
    appWriteID
} from './constants'

import {
    saveUserAccount
} from "./redux/slices/userSlice";

import store from "./redux/store";



// init db
const appwrite = new Appwrite();
appwrite
    .setEndpoint('http://localhost/v1') // Your Appwrite Endpoint
    .setProject(appWriteID) // Your project ID
;

////////// APP START




////////// USER FUNCTIONS 

export function signOutUser() {
    let promise = appwrite.account.deleteSessions();

    promise.then(function (response) {
        console.log(response); // Success

    }, function (error) {
        console.log(error); // Failure
    });
}


export function createUserAccount(email, password) {

    // Create User
    let promise = appwrite.account.create(email, password);
    promise.then(function (response) {
        // Get UID 
        const uid = response.$id
        // Sign In
        signInNewUser(email, password, uid)

    }, function (error) {
        console.log(error); // Failure
    });
}

export function signInNewUser(email, password, uid) {
    let promise = appwrite.account.createSession(email, password);

    promise.then(function (response) {
        // Create User Doc
        createUserDoc(uid, email);

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
        // push doc-id as user name
        const userDocID = response.$id;
        updateUserName(userDocID, uid, email);

    }, function (error) {
        console.log(error); // Failure
    });

}

export function updateUserName(userDocID, uid, email) {

    // sign in user


    // update name

    let promise = appwrite.account.updateName(userDocID);

    promise.then(function (response) {

        // trigger redux state change

        store.dispatch(saveUserAccount({email, uid}));

    }, function (error) {
        console.log(error); // Failure
    });

}


export function signInUser(email, password, uid) {
    let promise = appwrite.account.createSession(email, password);

    promise.then(function (response) {
        console.log(response); // Success

    }, function (error) {
        console.log(error); // Failure
    });
}

export async function getAccount() {
    let promise = appwrite.account.get();

    promise.then(function (response) {
        console.log(response); // Success
        return true
    }, function (error) {
        console.log(error); // Failure
        return false
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
