// APPWRITE 
import {
    Appwrite
} from "appwrite";
import {
    appWriteID, firebaseConfig
} from './constants'

// Init your Web SDK
const appwrite = new Appwrite();
appwrite
    .setEndpoint('http://localhost/v1') // Your Appwrite Endpoint
    .setProject(appWriteID) // Your project ID
    ;

import firebase from 'firebase'



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


export function uploadDog(dog) {
    //upload dog here
    console.log("Getting ready to upload the following")
    console.log(dog)
}


export function createUserDoc(uid, email) {


    //upload dog here
    console.log("Getting ready to create user")
    console.log(uid);

    const userDoc = {
        uid: uid,
        email: email,
        zone: false

    }

    // FIREBASE METHOD
    var db = firebase.firestore();

    // db.collection("users").add(userDoc)
    //     .then((docRef) => {
    //         console.log("Document written with ID: ", docRef.id);
    //     })
    //     .catch((error) => {
    //         console.error("Error adding document: ", error);
    //     });


    // APPWRITE METHOD

    appwrite.database.createDocument('619f011dd6cc2', {uid: uid,email: email, zone: false}).
        then(function (response) {
            console.log(response); // Success
        }, function (error) {
            console.log(error); // Failure
        });

}
