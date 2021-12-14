// APPWRITE 
import {
    Appwrite
} from "appwrite";
import {
    appWriteID,
    usersCollection,
    dogsCollection,
    zoneCollection,
    firebaseConfig
} from './constants'

import userSlice, {
    changeStatus,
    saveDogCards,
    saveUserAccount,
    saveUserDetails,
    signInAccount,
    addDogtoUser
} from "./redux/slices/userSlice";

import store from "./redux/store";

import firebase from "firebase";
import {
    saveDogPic, saveOwner
} from "./redux/slices/rawDogSlice";
import { saveCoords, saveZone, addTag } from "./redux/slices/exploreSlice";

const app = firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
var storage = firebase.storage();
var storageRef = firebase.storage().ref();

// init db
const appwrite = new Appwrite();
appwrite
    .setEndpoint('http://localhost/v1') // Your Appwrite Endpoint
    .setProject(appWriteID) // Your project ID
;

////////// APP START

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        const email = user.email;
        store.dispatch(signInAccount({
            email,
            uid
        }))

        getUserDetails(uid);


        // ...
    } else {
        // User is signed out
        // ...
        store.dispatch(changeStatus('new'))

    }
});


////////// USER FUNCTIONS 

export function signOutUser() {
    const {
        email,
        uid,
        name
    } = false;

    store.dispatch(signInAccount({
        email,
        uid
    }))

    firebase.auth().signOut();
    store.dispatch(changeStatus('new'))

}


export function createUserAccount(email, password) {


    // FIREBASE
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in 
            // Get UID 
            const uid = userCredential.user.uid

            // Sign In
            createUserDoc(email, uid)
        })
        .catch((error) => {
            var errorCode = error.code;
            // ..
        });

}

export async function createUserDoc(email, uid) {

    console.log("Getting ready to create user")
    console.log(uid);

    // Add a new document in collection "cities"
    db.collection("users").doc(uid).set({
            uid: uid,
            email: email,
            zone: "Unverified",
            dogs: []
        })
        .then(() => {
            console.log("Created new user!");
            // trigger redux state change

            store.dispatch(saveUserAccount({
                email,
                uid
            }));

            store.dispatch(changeStatus('returning'))
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });



}


export function signInUser(email, password) {

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            getUserDetails(user.uid);
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage)
        });
}


export function getUserDetails(uid) {

    var docRef = db.collection("users").doc(uid);

    docRef.get().then((doc) => {
        if (doc.exists) {
            let response = doc.data()
            console.log("Welcome back User", response);
            const userData = {
                email: response.email,
                uid: response.uid,
                zone: response.zone,
                dogs: response.dogs,
            }
            store.dispatch(saveUserDetails(userData));
            store.dispatch(saveZone(response.zone))

            if (response.dogs.length > 0) {
                unwrapDogs(response.dogs)

            } else {
                store.dispatch(changeStatus('returning'))

            }
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });


    // db.collection("users").doc(uid).get().then((doc) => {
    //     if (doc.exists) {
    //         const response = doc.data()
    //         console.log("Document data:", doc.data());
    //         const userData = {
    //             email: response.email,
    //             uid: response.uid,
    //             zone: response.zone,
    //             dogs: response.dogs,
    //         }
    //         store.dispatch(saveUserDetails(userData));

    //         if (response.dogs.length > 0) {
    //             unwrapDogs(response.dogs)

    //         } else {
    //             store.dispatch(changeStatus('returning'))

    //         }
    //     } else {
    //         // doc.data() will be undefined in this case
    //         console.log("No such document!");
    //     }
    // }).catch((error) => {
    //     console.log("Error getting document:", error);
    // });


}



////////// DOG FUNCTIONS 

export async function startPublish(imageURI) {
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

    // get user uid
    const uid = store.getState().user.uid
    store.dispatch(saveOwner(uid))

    // get rawDog state
    const rawDog = store.getState().rawDog

    // upload rawDog
    console.log("going to post", rawDog)

    // Add a new document with a generated id.

    db.collection("dogs").add(rawDog).then((docRef) => {
            // get duid
            const duid = docRef.id
            console.log("Created Dog Doc: ", duid);

            // add duid to user dog list 
            store.dispatch(addDogtoUser(duid))

            // get new list 
            const newList = store.getState().user.dogs

            // post new dog list 
            var userRef = db.collection("users").doc(uid);
            userRef.update({
                    dogs: newList
                })
                .then(() => {
                    console.log("Updated dog list!");

                })
                .catch((error) => {
                    // The document probably doesn't exist.
                    console.error("Error updating document: ", error);
                });

     
            // upload image with duid 
            storageRef.child('profileImages/' + uid + '.jpg').put(blob).then((response) => {
                console.log("uploaded dog");

                response.ref.getDownloadURL().then((PURI) => {

                    // add profileURL to rawDOG document
                    var dogRef = db.collection("dogs").doc(duid);
                    var PURITask = dogRef.update({
                            profileImage: PURI
                        })
                        .then(() => {
                            console.log("added dog URL");
                            window.location.reload();

                        })
                        .catch((error) => {
                            // The document probably doesn't exist.
                            console.error("Error updating document: ", error);
                        });


                    // add profileURL to user??? 


                }).catch((error) => {
                    console.log(error)
                })
            }).catch((error) => {
                // The document probably doesn't exist.
                console.error("photo upload errror", error);
            });


        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });


}



// export async function createDog(dogData) {

//     console.log("uploading:");
//     console.log(dogData);

//     // Add a new document with a generated id.
//     let promise = db.collection("dogs").add(dogData)

//     promise.then((data) => {
//         if (data) {
//             console.log("Document data:", data);
//             // store.dispatch(changeStatus('returning'))
//             // store.dispatch(saveDogCards(doc.data()));
//         } else {
//             // doc.data() will be undefined in this case
//             console.log("No such document!");
//         }
//     })

//     return promise
// }


export function unwrapDogs(dogs) {

    if (dogs) {
        dogs.map(dog => {
            var docRef = db.collection("dogs").doc(dog);

            docRef.get().then((doc) => {
                if (doc.exists) {
                    console.log("Document data:", doc.data());
                    store.dispatch(saveDogCards(doc.data()));
                    store.dispatch(changeStatus('returning'))
                    store.dispatch(saveCoords(doc.data().coords))


                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                    store.dispatch(changeStatus('returning'))

                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });

        })
    }

}


export function getHomies(zone) {

    console.log("getting homies in", zone);

    db.collection("dogs").where("zone", "==", zone)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            const dog = doc.data()
            console.log("Found Dog => ", dog);
            // createTag

            const tag = {
                id: doc.id,
                coords: dog.coords,
                zone: dog.zone
            }
            store.dispatch(addTag(tag))

         
        });
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
}
