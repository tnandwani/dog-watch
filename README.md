# DOG WATCH
## A COMMUNITY FOR DOG OWNERS

**Features**
- Find my dog
- Community Feed
- Dog adoption page
- Resources

--------------------------------
### LEFT TO DO 

- NOW
    - user status 
        1. Create user session
        2. Add Event lister for auth changes
 
- NEXT 

    - Create Dog
        1. Input -> Store on type
        2. Store -> DogCard with useSelector
        3. upload photo 
            - save uri
        4. save dog to db
            - push state
            - push uri
            - save duid  
        5. update user
            - push duid to owner doc

- LATER
    - Join Neighborhood Button
        1. Get location onPress
        2. reverse Geocode
        3. Save coorinates/address to db (user + dog)
    - Explore Page
        1. Add home marker to map
        2. add dog markers in your zone
    - Fill Resources 
        1. Make info page UI
        2. pull data from websites to app 
        3. seperate by breed when applicable 
    - Home/Feed layout - rough draft
        1. design post 
        2. post content structure 
        3. upload post button
        4. 


### ISSUES

- firebase vs AppWrite???
    - Appwrite
        - needs permissions for every read/write
        - permissions tied to user object (cant use firebase with AW?)
        - currently making users over firebase



    - Firebase expensive and clunky


Backend Needs
- auth (email)
    - sign in listener
    - 
