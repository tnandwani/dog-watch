// keys and consts
import {
    firebaseConfig
} from './constants';

import 'react-native-get-random-values';
import {
    v4 as uuidv4
} from 'uuid';

import {
    manipulateAsync,
    SaveFormat
} from 'expo-image-manipulator';

// REDUX
import store from "./redux/store";
import {
    changeStatus,
    saveDogCards,
    saveUserDetails,
    signInAccount,
    markLostDog,
    removeDogfromUser,
    updateLocation,
    changeDogInUser
} from "./redux/slices/userSlice";
import {
    createDUID,
    saveOwner
} from "./redux/slices/rawDogSlice";
import {
    addLocalAlert,
    addTag,
    removeTag,
    foundZoneDog,
    saveZoneData,
    updateDogView,
    updateLoading,
    addLostDog,
    updatePushToken,
    resetZone,
} from "./redux/slices/exploreSlice";

// FIREBASE
import {
    initializeApp,
} from 'firebase/app';


// auth 
import {
    getAuth,
    signInAnonymously,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    signInWithRedirect,
    GoogleAuthProvider,
    signInWithCredential,
    signOut
} from 'firebase/auth';


// firestore
import {
    getFirestore,
    collection,
    setDoc,
    addDoc,
    getDocs,
    getDoc,
    query,
    where,
    updateDoc,
    arrayUnion,
    increment,
    deleteDoc,
    arrayRemove,
    doc,
    Timestamp
} from 'firebase/firestore';

import {
    getDownloadURL,
    getStorage,
    uploadBytes,
    ref,
    uploadString,
} from "firebase/storage";
import {
    saveDogPic
} from './redux/slices/rawDogSlice';
import {
    sendNotificationtoZone
} from './notifcations/server';

import * as Analytics from 'expo-firebase-analytics';

import * as Sentry from 'sentry-expo';


// Analytics.resetAnalyticsData();
import {
    updateCreateAlert,
    updateDogProgress,
    updateLoginAlert,
    updateShowDogModal
}
from './redux/slices/interfaceSlice';
import {
    Platform
} from 'react-native';
////////// APP START

if (Platform.OS !== 'web') {
    // TURN ON DEBUG MODE HERE
    Analytics.setDebugModeEnabled(true);
}


initializeApp(firebaseConfig)
const auth = getAuth();
const storage = getStorage();
const db = getFirestore();

onAuthStateChanged(auth, user => {
    if (user != null) {
        const uid = user.uid;
        const email = user.email;
        const device = store.getState().device;

        if (!email) {
            store.dispatch(signInAccount({
                uid
            }))
            store.dispatch(changeStatus('new'))

        } else {
            store.dispatch(signInAccount({
                email,
                uid
            }))
            getUserDetails(uid, email);

        }


        Analytics.setUserId(uid);
        Analytics.logEvent('auto_logged_in')

    } else {
        store.dispatch(changeStatus('new'))


        // if (store.getState().user.device !== 'web') {
        //     Analytics.resetAnalyticsData();
        // }

    }

});


//////////////////// UI FUNCTIONS 
export function setScreenAnalytics(screenName) {
    if (screenName === "Landing") {
        if (store.getState().user.uid != 'unknown') {
            signOutUser();
        }
    }
    Analytics.setCurrentScreen(screenName);
}
export function sendFeedback(type, message) {


    const user = store.getState().user

    if (type) {
        type = "Suggestion"
    } else {
        type = "Issue"
    }

    addDoc(collection(db, "feedback"), {
        uid: user.uid,
        zone: user.zone,
        timestamp: new Date(),
        type: type,
        message: message
    }).then((result) => {
        Analytics.logEvent('feedback_sent', uAnalytics())
        // initialize analytics per user details

    }).catch((error) => {
        sendFireError(error.message, "sendFeedback.addDoc");
    });
}

export function viewDog(dog) {
    //send dog to redux

    store.dispatch(updateDogView(dog))
    // show modal
    store.dispatch(updateShowDogModal(true))

}

export function fLogEvent(name) {
    Analytics.logEvent(name);
}

//////////////////// USER AUTH FUNCTIONS 


export function socialSignIn(credential) {


    signInWithCredential(auth, credential).then((result) => {
        console.log(result)
    }).catch((err) => {
        console.log(err)
        sendFireError(err, 'Apple.login.firebase')


    });
}
export async function signAnon() {

    signInAnonymously(auth)
        .then(() => {
            store.dispatch(changeStatus('new'))

            // Signed in..
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // ...
        });
}

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

    signOut(auth);
    store.dispatch(changeStatus('new'))
    // Analytics.resetAnalyticsData();



}

export function createUserAccount(email, password, confirm) {
    signOut(auth);
    if (password === confirm) {
        // FIREBASE
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                // Get UID 
                const uid = userCredential.user.uid;
                // Sign In
                createUserDoc(email, uid)
            })
            .catch((error) => {
                sendFireError(error.message, "createUserAccount.createUserWithEP");
                store.dispatch(updateCreateAlert(error.message))
            });
    } else {
        store.dispatch(updateCreateAlert("Passwords do not match"))
    }



}

export async function createUserDoc(email, uid) {

    // add user to redux
    store.dispatch(signInAccount({
        email,
        uid
    }));
    // create user doc

    try {
        const docRef = await setDoc(doc(db, "users", uid), {
            uid: uid,
            email: email,
            zone: "Unverified",
            dogs: [],
            reported: [],
            created: new Date().toUTCString()
        });

        store.dispatch(changeStatus('returning'))
        Analytics.logEvent('User_Sign_Up_Finished', uAnalytics())


    } catch (error) {
        sendFireError(error.message, "createUserDoc.setDoc");
    }
}

export function signInUser(email, password) {

    const uid = "attempting-user";
    signOut(auth);

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            getUserDetails(user.uid, email);
        })
        .catch((error) => {

            sendFireError(error.message, "signInUser.signInWith");
            store.dispatch(updateLoginAlert(error.message))

        });
}

export async function getUserDetails(uid, email) {

    getMyHomies(uid);

    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        let response = docSnap.data();


        // initialize analytics per user details
        if (Platform.OS === 'web') {
            Sentry.Browser.setUser({
                id: response.uid,
                email: response.email
            })
            Sentry.Browser.setTag("zone", response.zone)
        } else {
            Sentry.Native.setUser({
                id: response.uid,
                email: response.email
            })

            Sentry.Native.setTag("zone", response.zone)

        }
        store.dispatch(saveUserDetails(response));
        Analytics.setUserProperties(uAnalytics())

        store.dispatch(changeStatus('returning'))

    } else {
        Analytics.logEvent('User_doc_not_found', uAnalytics())

        if (uid && email) {
            createUserDoc(email, uid)
        }
    }


}

export function reportUser(reportedDog) {
    const userRef = doc(db, "users", reportedDog.owner);
    const dogRef = doc(db, "dogs", reportedDog.duid);
    const uid = store.getState().user.uid
    const device = store.getState().user.device

    // if already reported. double check
    if (!reportedDog.reported.includes(uid)) {
        // report user
        updateDoc(userRef, {
            reported: arrayUnion(uid)
        }).then((result) => {
            // remove dog from local explore
            updateDoc(dogRef, {
                reported: arrayUnion(uid)
            }).then((result) => {
                Analytics.logEvent('reported_user', {
                    uid: uid,
                    device: device,
                    reported: reportedDog.owner,
                    dog: reportedDog.duid
                })
                store.dispatch(removeTag(reportedDog.duid));

            }).catch((error) => {
                sendFireError(error.message, "reportUser.updateDoc.dogRef");
            });

        }).catch((error) => {
            sendFireError(error.message, "reportUser.updateDoc.userRef");

        });
    } else {
        Analytics.logEvent('reported_user_again', {
            uid: uid,
            device: device,
            reported: reportedDog.owner,
            dog: reportedDog.duid
        })
    }

}

//////////////////// ZONE FUNCTIONS 

export async function getMyHomies(uid) {
    const dogsRef = collection(db, "dogs");

    const userQ = query(dogsRef, where("owner", "==", uid));
    const myDogs = await getDocs(userQ);

    myDogs.forEach((doc) => {
        store.dispatch(saveDogCards(doc.data()))
    });

}
export async function getHomies() {

    Analytics.logEvent('getting_homies_start', uAnalytics())

    store.dispatch(resetZone())
    // GET DOGS WITH ZIPCODE
    const zone = store.getState().user.zone
    const uid = store.getState().user.uid

    const dogsRef = collection(db, "dogs");

    const zoneQ = query(dogsRef, where("zone", "==", zone));
    const zoneSnapshot = await getDocs(zoneQ);

    let homiesArray = [];

    zoneSnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        if (doc.data().reported < 1 || doc.data().owner == uid) {
            homiesArray.push(doc.data())
        }
    });
    if (homiesArray.length > 0) {
        // got all dogs in zone 
        homiesArray.forEach((dog) => {

            // get my dogs 
            // if (dog.owner == uid) {
            //     store.dispatch(saveDogCards(dog))
            // }
            // if not reported by user
            if (!dog.reported.includes(uid)) {
                // get visible dogs
                if (dog.visibility == 'n') {
                    store.dispatch(addTag(dog));
                }
                // fget lost dogs
                if (dog.lost == true) {
                    store.dispatch(addLostDog(dog))

                }
            }
        })
    }
    store.dispatch(updateLoading(false));
    Analytics.logEvent('got_homies_finish', uAnalytics())

}

export async function addUsertoZone(pushToken) {

    // add token to user
    const uid = store.getState().user.uid
    const userToken = store.getState().user.pushToken
    const userRef = doc(db, "users", uid);

    // check if new token
    console.log("old token is, ", userToken)
    console.log("new token is, ", pushToken)


    if (userToken !== pushToken) {
        updateDoc(userRef, {
            pushToken: pushToken
        }).catch((error) => {
            sendFireError(error.message, "addUsertoZone.updateDoc.userRef");
        });

        // add token to zone
        const zone = store.getState().user.zone
        const zoneRef = doc(db, "zones", zone);
        // const zoneDoc = await getDoc(zoneRef);

        if (zone !== "Unverified") {
            updateDoc(zoneRef, {
                members: arrayUnion(pushToken)
            }).then((resp) => {
                Analytics.logEvent('joined_neighborhood_notigang', uAnalytics())
            }).catch((error) => {

                if (error.message.includes("No document to update")) {
                    Analytics.logEvent('FIRST_TIME_ZONER', uAnalytics())
                    setDoc(doc(db, "zones", zone), {
                        members: [pushToken]
                    });
                } else {
                    sendFireError(error.message, "addUsertoZone.updateDoc.zoneRef");
                }
            })
        }
    }
    store.dispatch(updatePushToken(pushToken))
}


export async function updateFireLocation(location) {

    // get user details
    const uid = store.getState().user.uid
    const pushToken = store.getState().user.pushToken

    const userRef = doc(db, "users", uid);
    updateDoc(userRef, {
        zone: location.zone,
        longitude: location.longitude,
        latitude: location.latitude,
    }).then(() => {
        Analytics.logEvent('Updated_user_Location', uAnalytics())
    }).catch((error) => {
        sendFireError(error.message, "updateFireLocation.updateDoc.userRef");
    })

    if (pushToken) {
        addUsertoZone(pushToken);
        Analytics.logEvent('Added_Token_to_Zone', uAnalytics())
    }

}


//////////////////// DOG FUNCTIONS 



export async function startPublish(imageURI, navigation) {

    Analytics.logEvent('Create_dog_start', uAnalytics())

    // get owner
    const uid = store.getState().user.uid
    store.dispatch(saveOwner(uid))
    // create dog duid 
    const duid = uuidv4();
    // add duid to redux
    store.dispatch(createDUID(duid));


    // pic selected 
    if (imageURI != 'https://cdn.pixabay.com/photo/2013/11/28/11/31/dog-220273_960_720.jpg') {
        // convert image to blob
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", imageURI, true);
            xhr.send(null);
        });

        store.dispatch(updateDogProgress(10))
        // upload dog photo with duid 
        const storageRef = ref(storage, 'profileImages/' + duid);
        uploadBytes(storageRef, blob).then((snapshot) => {

            Analytics.logEvent('Created_dog_photo', uAnalytics())
            store.dispatch(updateDogProgress(25))

            // get download URL
            getDownloadURL(snapshot.ref).then((PURI) => {
                Analytics.logEvent('Created_dog_photoURL', uAnalytics())
                store.dispatch(updateDogProgress(50))


                // add url to redux
                store.dispatch(saveDogPic(PURI))

                const readyDog = store.getState().rawDog
                // upload readyDog to dogs/

                setDoc(doc(db, "dogs", duid), readyDog)
                    .then((resp) => {
                        Analytics.logEvent('Created_dog_doc', uAnalytics())
                        store.dispatch(updateDogProgress(75))

                        // add readyDog to user.dogs redux 
                        store.dispatch(saveDogCards(readyDog))
                        // post new dog list + update coords
                        const userRef = doc(db, "users", uid);

                        if (store.getState().user.zone != readyDog.zone) {
                            store.dispatch(updateLocation({
                                zone: readyDog.zone,
                                longitude: readyDog.longitude,
                                latitude: readyDog.latitude,
                            }))
                            getHomies();

                        } else {
                            store.dispatch(updateLocation({
                                zone: readyDog.zone,
                                longitude: readyDog.longitude,
                                latitude: readyDog.latitude,
                            }))
                        }
                        updateDoc(userRef, {
                            dogs: arrayUnion(duid),
                            zone: readyDog.zone,
                            longitude: readyDog.longitude,
                            latitude: readyDog.latitude,
                        }).then((resp) => {
                            Analytics.logEvent('add_dog_to_user', uAnalytics())

                            // add dogcard to explore locally 
                            store.dispatch(addTag(readyDog));

                            store.dispatch(updateDogProgress(100))
                            navigation.navigate('Profile')
                            store.dispatch(updateDogProgress(0))
                            Analytics.logEvent('Created_dog_finish', uAnalytics())

                        }).catch((error) => {
                            sendFireError(error.message, "startPublish.image.updateDoc.userRef");
                        })
                    })
                    .catch((error) => {
                        sendFireError(error.message, "startPublish.setDoc.duid");


                    })

            }).catch((error) => {
                sendFireError(error.message, "startPublish.getDownloadURL");
            });
        }).catch((error) => {
            sendFireError(error.message, "startPublish.uploadBytes");
        })

    }
    // use default pic
    else {
        Analytics.logEvent('Created_dog_photoURL', uAnalytics())
        store.dispatch(updateDogProgress(50))


        // add url to redux
        store.dispatch(saveDogPic(imageURI))

        const readyDog = store.getState().rawDog
        // upload readyDog to dogs/

        setDoc(doc(db, "dogs", duid), readyDog)
            .then((resp) => {
                Analytics.logEvent('Created_dog_doc', uAnalytics())
                store.dispatch(updateDogProgress(75))

                // add readyDog to user.dogs redux 
                store.dispatch(saveDogCards(readyDog))
                // post new dog list + update coords
                const userRef = doc(db, "users", uid);

                if (store.getState().user.zone != readyDog.zone) {
                    store.dispatch(updateLocation({
                        zone: readyDog.zone,
                        longitude: readyDog.longitude,
                        latitude: readyDog.latitude,
                    }))
                    getHomies();

                } else {
                    store.dispatch(updateLocation({
                        zone: readyDog.zone,
                        longitude: readyDog.longitude,
                        latitude: readyDog.latitude,
                    }))
                }



                getHomies();
                updateDoc(userRef, {
                    dogs: arrayUnion(duid),
                    zone: readyDog.zone,
                    longitude: readyDog.longitude,
                    latitude: readyDog.latitude,
                }).then((resp) => {
                    Analytics.logEvent('add_dog_to_user', uAnalytics())

                    // add dogcard to explore locally 
                    store.dispatch(addTag(readyDog));

                    store.dispatch(updateDogProgress(100))
                    navigation.navigate('Profile')
                    store.dispatch(updateDogProgress(0))
                    Analytics.logEvent('Created_dog_finish', uAnalytics())

                }).catch((error) => {
                    sendFireError(error.message, "startPublish.defaultImage.updateDoc.userRef");
                })
            })
            .catch((error) => {
                sendFireError(error.message, "startPublish.setDoc.duid");
            })
    }


}


export async function editPublish(imageURI, navigation) {

    Analytics.logEvent('Edit_dog_start', uAnalytics())


    // get owner
    const uid = store.getState().rawDog.owner
    // create dog duid 
    const duid = store.getState().rawDog.duid

    const readyDog = store.getState().rawDog

    store.dispatch(changeDogInUser(readyDog))

    // check if image uploaded 

    if (imageURI.includes("firebasestorage")) {
        // no new picture

        // upload readyDog to dogs/

        setDoc(doc(db, "dogs", duid), readyDog)
            .then((resp) => {
                Analytics.logEvent('Edited_dog_doc', uAnalytics())
                // add readyDog to user.dogs redux 
                // post new dog list + update coords
                const userRef = doc(db, "users", uid);
                updateDoc(userRef, {
                    zone: readyDog.zone,
                    longitude: readyDog.longitude,
                    latitude: readyDog.latitude,
                }).then((resp) => {
                    Analytics.logEvent('Edit_dog_finish', uAnalytics)
                    if (store.getState().user.zone != readyDog.zone) {
                        store.dispatch(updateLocation({
                            zone: readyDog.zone,
                            longitude: readyDog.longitude,
                            latitude: readyDog.latitude,
                        }))
                        getHomies();

                    } else {
                        store.dispatch(updateLocation({
                            zone: readyDog.zone,
                            longitude: readyDog.longitude,
                            latitude: readyDog.latitude,
                        }))
                    }
                    navigation.navigate('Profile')
                }).catch((error) => {
                    sendFireError(error.message, "editPublish.noimage.setDoc.updateDoc");
                })
            })
            .catch((error) => {
                sendFireError(error.message, "editPublish.noimage.setDoc.duid");
            })
    } else {


        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", imageURI, true);
            xhr.send(null);
        });

        // upload dog photo with duid 
        const storageRef = ref(storage, 'profileImages/' + duid + '.jpg');
        uploadBytes(storageRef, blob).then((snapshot) => {
            Analytics.logEvent('Edited_dog_photo', uAnalytics())

            // get download URL
            getDownloadURL(snapshot.ref).then((PURI) => {
                Analytics.logEvent('Edited_dog_photoURL', uAnalytics())

                // add url to redux
                store.dispatch(saveDogPic(PURI))

                const readyDog = store.getState().rawDog
                // upload readyDog to dogs/



                setDoc(doc(db, "dogs", duid), readyDog)
                    .then((resp) => {
                        Analytics.logEvent('Edited_dog_doc_wPhoto', uAnalytics)

                        // post new dog list + update coords
                        const userRef = doc(db, "users", uid);
                        updateDoc(userRef, {
                            zone: readyDog.zone,
                            longitude: readyDog.longitude,
                            latitude: readyDog.latitude,
                        }).then((resp) => {
                            Analytics.logEvent('Edited_dog_finish_wPhoto', uAnalytics())
                            // updateFire Loca
                            if (store.getState().user.zone != readyDog.zone) {
                                store.dispatch(updateLocation({
                                    zone: readyDog.zone,
                                    longitude: readyDog.longitude,
                                    latitude: readyDog.latitude,
                                }))
                                getHomies();

                            } else {
                                store.dispatch(updateLocation({
                                    zone: readyDog.zone,
                                    longitude: readyDog.longitude,
                                    latitude: readyDog.latitude,
                                }))
                            }

                            navigation.navigate('Profile')

                        }).catch((error) => {
                            sendFireError(error.message, "editPublish.image.updateDoc.users");
                        })
                    })
                    .catch((error) => {
                        sendFireError(error.message, "editPublish.image.uploadBytes");


                    })

            });
        }).catch((error) => {
            sendFireError(error.message, "editPublish.image.setDoc.duid");
        })
    }

}


export async function markLost(dog, EContact, index, message) {
    Analytics.logEvent('LOST_DOG_start', uAnalytics)

    const timestamp = new Date().toLocaleDateString('en-us')

    let lost = true
    // send changes to redux (local UI changes)
    store.dispatch(markLostDog({
        index,
        EContact,
        lost
    }));
    const alert = {
        duid: dog.duid,
        date: timestamp,
        message: message,
        contact: EContact,
    }


    // mark LOST in DOGS/duid
    const dogRef = doc(db, "dogs", dog.duid);
    updateDoc(dogRef, {
        lost: true,
        contact: EContact,
        alert: alert
    }).then(() => {
        Analytics.logEvent('LOST_DOG_marked_publicly', uAnalytics)
        // change dog var
        dog.lost = true;
        dog.contact = EContact;
        dog.alert = alert;
        store.dispatch(addLostDog(dog))

    }).catch(error => {
        sendFireError(error.message, "markLost.updateDoc.dogRef");

    });
    const zone = store.getState().user.zone
    const docRef = doc(db, "zones", zone);
    getDoc(docRef).then((docSnap) => {
            if (docSnap.exists()) {
                let members = docSnap.data().members
                store.dispatch(saveZoneData(members));

                sendNotificationtoZone(dog, alert, members).then((result) => {
                    Analytics.logEvent('LOST_DOG_notifications_sent', uAnalytics())

                }).catch((error) => {
                    sendFireError(error.message, "markLost.getDoc.zoneRef.sendNotificationtoZone");

                });
            } else {
                // doc.data() will be undefined in this case
                sendFireError(error.message, "markLost.getDoc.zoneRef.noZoneExist");
            }

        })
        .catch((error) => {
            sendFireError(error.message, "markLost.getDoc.zoneRef");


        })

}

export async function markFound(dog, index) {
    let lost = false;
    let EContact = dog.contact
    // mark in DOGS
    const dogRef = doc(db, "dogs", dog.duid);
    updateDoc(dogRef, {
        lost: lost,
        alert: null,
    }).then(() => {
        Analytics.logEvent('DOG_FOUND_marked_publicly', uAnalytics())
    }).catch((error) => {
        sendFireError(error.message, "markFound.updateDoc");
    });
    // mark dog as found in user locally 
    store.dispatch(markLostDog({
        index,
        EContact,
        lost
    }));
    // mark dog as found in zone locally 
    store.dispatch(foundZoneDog(dog.duid))
}
export function deleteDog(duid, uid, navigation) {

    Analytics.logEvent('delete_dog_started', uAnalytics())

    const rawDog = store.getState().rawDog

    // delete dog doc
    deleteDoc(doc(db, "dogs", duid)).then((resp) => {
        // remove dog from user list
        const userRef = doc(db, "users", uid);
        Analytics.logEvent('deleted_dog_doc', uAnalytics())


        // update doc with new user list
        updateDoc(userRef, {
            dogs: arrayRemove(duid)
        }).then((resp) => {
            // update redux state
            Analytics.logEvent('deleted_dog_completed', uAnalytics())
            // remove dog from user redux list
            store.dispatch(removeDogfromUser(duid))
            // remove dog locally from explore tags
            store.dispatch(removeTag(duid));

            navigation.navigate('Profile')
        }).catch((error) => {
            sendFireError(error.message, "deleteDog.deleteDoc.userRef");

        });
    }).catch((error) => {
        sendFireError(error.message, "deleteDog.deleteDoc.duid");

    });

}

export function sendFireError(error, func) {


    console.log({
        error,
        func
    });

    const user = store.getState().user;
    sendSentryMessage(func + " : " + error)

    Analytics.logEvent('fire_error', {
        uid: user.uid, // from redux 
        device: user.device, // from redux
        message: error,
        func: func,
        time: new Date()
    })
}
export function uAnalytics() {
    const user = store.getState().user;

    return ({
        zone: user.zone,
        device: user.device
    })
}

export function sendSentryMessage(message, context) {
    context = 'hello'
    if (Platform.OS === 'web') {
        Sentry.Browser.captureMessage(message, context);
    } else {
        Sentry.Native.captureMessage(message)
    }

}

//  NEW PUBLISHER TEST


let navigator;

export async function testPublish(navigation) {


    navigator = navigation;

    // 1. get uid  
    const uid = store.getState().user.uid
    store.dispatch(saveOwner(uid))

    // 2. create dog duid 
    const duid = uuidv4();
    store.dispatch(createDUID(duid));

    let imageURI = store.getState().rawDog.profileImage
    // if pic selected 
    if (imageURI !== 'https://cdn.pixabay.com/photo/2013/11/28/11/31/dog-220273_960_720.jpg') {
        // 3a. Convert pic (optional) 
        convertImage(imageURI);

        // 3b. upload pic + get URL (optional)
    } else {
        createDogDoc()
    }

    // 4. create dog doc 

    // 5. add duid to user 

}

export async function testEditPublish(navigation) {

    navigator = navigation;

    // get owner
    const uid = store.getState().rawDog.owner
    // create dog duid 
    const duid = store.getState().rawDog.duid

    let imageURI = store.getState().rawDog.profileImage


    console.log("edited pic is: ", imageURI)
    // if new pic selected 
    if (imageURI !== 'https://cdn.pixabay.com/photo/2013/11/28/11/31/dog-220273_960_720.jpg' && !imageURI.includes("firebasestorage")) {

        // 3a. Convert pic (optional) 
        convertImage(imageURI);

        // 3b. upload pic + get URL (optional)
    } else {
        createDogDoc()
    }
}


export async function convertImage(imageURI) {
    console.log('3a')

    // convert to JPG
    const manipResult = await manipulateAsync(
        imageURI,
        [], {
            compress: 1,
            format: SaveFormat.JPEG
        }
    );

    console.log("mani result ", manipResult)
    // convert to blob

    const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        console.log('3a.1')

        xhr.onload = function () {
            resolve(xhr.response);
        };
        xhr.onerror = function (e) {
            reject(new TypeError("Network request failed"));
        };
        console.log('3a.2')
        xhr.responseType = "blob";
        xhr.open("GET", manipResult.uri, true);
        xhr.send(null);
    });

    console.log('3a.3')
    // start upload photo
    uploadPhoto(blob);


}

export function uploadPhoto(blob) {
    console.log('3b')

    const duid = store.getState().rawDog.duid
    const storageRef = ref(storage, 'profileImages/' + duid);

    // upload as blob
    uploadBytes(storageRef, blob).then((snapshot) => {
        console.log('3c')
        console.log('Uploaded a blob file!');
        getDownloadURL(snapshot.ref).then((PURI) => {
            // add url to redux
            console.log('3d')

            store.dispatch(saveDogPic(PURI))
            createDogDoc()
        }).catch((error) => {
            sendFireError(error.message, "startPublish.64.getDownloadURL");
        });
    }).catch((error) => {
        sendFireError(error.message, "startPublish.blob.uploadBytes");
    })

}

export function createDogDoc() {
    console.log('4')

    console.log("starting to upload Dog");
    const readyDog = store.getState().rawDog
    // upload readyDog to dogs/

    setDoc(doc(db, "dogs", readyDog.duid), readyDog)
        .then(() => {

            addDogToUser(readyDog);

        })
        .catch((error) => {
            sendFireError(error.message, "startPublish.setDoc.duid");
        })



}

export function addDogToUser(readyDog) {
    console.log('5')
    const uid = readyDog.owner;
    const duid = readyDog.duid;

    const oldZone = store.getState().user.zone
    const userRef = doc(db, "users", uid);

    updateDoc(userRef, {
        dogs: arrayUnion(duid),
        zone: readyDog.zone,
        longitude: readyDog.longitude,
        latitude: readyDog.latitude,
    }).then(() => {
        console.log('6')

        // get new homies if in new zone
        if (oldZone !== readyDog.zone) {
            getHomies(readyDog.zone);
        }

        // update locally 
        if (readyDog.editing) {
            store.dispatch(changeDogInUser(readyDog))
        } else {
            // add dogcard to explore locally 
            store.dispatch(addTag(readyDog));
            // add dogcard to user locally 
            store.dispatch(saveDogCards(readyDog))
        }

        navigator.navigate('Profile');

    }).catch((error) => {
        sendFireError(error.message, "startPublish.image.updateDoc.userRef");
    })
}
