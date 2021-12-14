// FIREBASE
import {
    firebaseConfig,
    vapidKey
} from './constants'
import store from "./redux/store";
import firebase from "firebase";

const app = firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();
var storageRef = firebase.storage().ref();
const analytics = firebase.analytics();
const messaging = firebase.messaging();


// REDUX
import {
    changeStatus,
    saveDogCards,
    saveUserAccount,
    saveUserDetails,
    signInAccount,
    addDogtoUser
} from "./redux/slices/userSlice";
import {
    saveDogPic,
    saveOwner
} from "./redux/slices/rawDogSlice";
import {
    saveCoords,
    saveZone,
    addTag,
    updateVapid
} from "./redux/slices/exploreSlice";

////////// APP START

export function getNotifications() {

    // Get registration token. Initially this makes a network call, once retrieved
    // subsequent calls to getToken will return from cache.
    messaging.getToken({
        vapidKey: vapidKey
    }).then((currentToken) => {
        if (currentToken) {
            // Send the token to your server and update the UI if necessary
            store.dispatch(updateVapid(token))
            // Handle incoming messages. Called when:
            // - a message is received while the app has focus
            // - the user clicks on an app notification created by a service worker
            //   `messaging.onBackgroundMessage` handler.
            messaging.onMessage((payload) => {
                console.log('Message received. ', payload);
                // ...
            });
        } else {
            // Show permission request UI
            console.log('No registration token available. Request permission to generate one.');
            // ...
        }
    }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
        // ...
    });
}


firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        analytics.logEvent("logged in")
        const uid = user.uid;
        const email = user.email;
        store.dispatch(signInAccount({
            email,
            uid
        }))

        getUserDetails(uid);
        getNotifications();




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
            analytics.logEvent("error: creating user");
            analytics.logEvent(error.message);


            // ..
        });

}

export async function createUserDoc(email, uid) {

    console.log("Getting ready to create user")
    console.log(uid);

    // creatubg user doc
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
            analytics.logEvent("error: creater user doc");

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
            console.log(errorMessage);
            analytics.logEvent("error: signing in");

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
            analytics.logEvent("error: user doc does not exist");

        }
    }).catch((error) => {
        console.log("Error getting User:", error);
        analytics.logEvent("error: could download user doc");
        analytics.logEvent(error.message);


    });

}



////////// DOG FUNCTIONS 

export async function startPublish(imageURI) {

    analytics.logEvent('started to create dog');

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
                    analytics.logEvent("error: adding dog to user list");

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
                            analytics.logEvent("error: could not update profile URL to dogs");
                            console.error("Error updating document: ", error);
                        });


                    // add profileURL to user??? 


                }).catch((error) => {
                    console.log(error)
                    analytics.logEvent("error: could not DL profile URL");

                })
            }).catch((error) => {
                // The document probably doesn't exist.
                console.error("photo upload errror", error);
                analytics.logEvent("error: photo upload error");

            });


        })
        .catch((error) => {
            console.error("Error adding document: ", error);
            analytics.logEvent("error: creating dog");

        });


}



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
                    analytics.logEvent("error: dog file not found");


                }
            }).catch((error) => {
                console.log("Error getting document:", error);
                analytics.logEvent("error: unwrap dog error");

            });

        })
    }

}


export function getHomies(zone) {

    console.log("getting homies in", zone);
    analytics.logEvent('getting tags');

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
            analytics.logEvent("error: loading zone homies");

        });
}
