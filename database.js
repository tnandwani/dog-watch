// APPWRITE 
import {
    Appwrite
} from "appwrite";
import {
    appWriteID,
    usersCollection
} from './constants'

import userSlice, {
    saveUserAccount,
    saveUserDetails,
    signInAccount
} from "./redux/slices/userSlice";

import store from "./redux/store";



// init db
const appwrite = new Appwrite();
appwrite
    .setEndpoint('http://localhost/v1') // Your Appwrite Endpoint
    .setProject(appWriteID) // Your project ID
;

////////// APP START

getUserAccount();

export function getUserAccount() {

    let promise = appwrite.account.get();

    promise.then(function (response) {
        console.log(response); // Success
        const uid = response.$id
        const email = response.email
        const name = response.name

        store.dispatch(signInAccount({
            email,
            uid,
            name
        }))

    }, function (error) {
        console.log(error); // Failure
    });

}

////////// USER FUNCTIONS 

export function signOutUser() {
    const {
        email,
        uid,
        name
    } = false;

    store.dispatch(signInAccount({
        email,
        uid,
        name
    }))
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

        store.dispatch(saveUserAccount({
            email,
            uid
        }));

    }, function (error) {
        console.log(error); // Failure
    });

}


export function signInUser(email, password) {
    let promise = appwrite.account.createSession(email, password);

    promise.then(function (response) {
        console.log(response); // Success
        getUserAccount();


    }, function (error) {
        console.log(error); // Failure
    });
}


export function getUserDetails() {

    // get username
    const username = store.getState().user.username
    console.log("getting file for " + username)
    // get doc with Username
    let promise = appwrite.database.getDocument(usersCollection, username);

    promise.then(function (response) {
        console.log("got doc"); // Failure

        const userData = {
            email: response.email,
            uid: response.uid,
            zone: response.zone,
            dogs: response.dogs,
            username: username
        }
        store.dispatch(saveUserDetails(userData));

    }, function (error) {
        console.log("no doc found"); // Failure
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
