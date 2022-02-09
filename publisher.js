export async function publish(imageURI, navigation) {

    Analytics.logEvent('Create_dog_start', uAnalytics())

    // 1. get uid  
    const uid = store.getState().user.uid
    store.dispatch(saveOwner(uid))

    // 2. create dog duid 
    const duid = uuidv4();
    store.dispatch(createDUID(duid));

    // 3. upload pic
    // 4. get picURL

    // 5. create dog doc 

    // 6. add duid to user 

}

export function uploadPhoto(imageURI){

}

export function convertImage(inputImage){

}


export function uploadDogDoc(readyDog){

}

export function addDogToUser(duid, uid){
    
}
