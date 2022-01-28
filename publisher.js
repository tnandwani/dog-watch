export async function startPublish(imageURI, navigation) {

    Analytics.logEvent('Create_dog_start', uAnalytics())

    // 1. get uid / create DUID 
    // 2. upload pic
    // 3. get picURL
    // 4. create dog doc 
    // 5. add duid to user 

    // get owner
    const uid = store.getState().user.uid
    // add owner to rawdog redux
    store.dispatch(saveOwner(uid))
    // create dog duid 
    const duid = uuidv4();
    // add duid to rawdog redux
    store.dispatch(createDUID(duid));


    


    // no image
    if (imageURI == 'https://freesvg.org/img/Dog-Leash.png') {

    } else {

    }






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
    const storageRef = ref(storage, 'profileImages/' + duid + '.jpg');
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

export async function editPublish(imageURI, navigation) {

    Analytics.logEvent('Edit_dog_start', uAnalytics())


    // get owner
    const uid = store.getState().rawDog.owner
    // create dog duid 
    const duid = store.getState().rawDog.duid


    // check if image uploaded 

    if (imageURI.includes("firebasestorage")) {
        // no new picture
        const readyDog = store.getState().rawDog
        // upload readyDog to dogs/

        setDoc(doc(db, "dogs", duid), readyDog)
            .then((resp) => {
                Analytics.logEvent('Edited_dog_doc', uAnalytics())
                // add readyDog to user.dogs redux 
                store.dispatch(changeDogInUser(readyDog))
                // post new dog list + update coords
                const userRef = doc(db, "users", uid);
                updateDoc(userRef, {
                    zone: readyDog.zone,
                    longitude: readyDog.longitude,
                    latitude: readyDog.latitude,
                }).then((resp) => {
                    Analytics.logEvent('Edit_dog_finish', uAnalytics)
                    navigation.navigate('Profile')
                }).catch((error) => {
                    sendFireError(error.message, "editPublish.noimage.setDoc.duid");
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
                        // add readyDog to user.dogs redux 
                        store.dispatch(changeDogInUser(readyDog))

                        // get list with new dog
                        const newList = store.getState().user.dogs

                        // post new dog list + update coords
                        const userRef = doc(db, "users", uid);
                        updateDoc(userRef, {
                            dogs: newList,
                            zone: readyDog.zone,
                            longitude: readyDog.longitude,
                            latitude: readyDog.latitude,
                        }).then((resp) => {
                            Analytics.logEvent('Edited_dog_finish_wPhoto', uAnalytics())

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
