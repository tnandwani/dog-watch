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
    - Signup 
        1. Create user doc with firebase uid
            2. Set Zone to false on signup

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
        
    - Join Neighborhood Button
        1. Get location onPress
        2. reverse Geocode
        3. Save coorinates/address to db (user + dog)

- LATER
    - add location markers to explore page
    - Fill Resources 
    - Home/Feed layout - rough draft


### ISSUES

- firebase vs AppWrite???
    - Appwrite
        - needs permissions for every read/write
        - permissions tied to user object (cant use firebase with AW?)
        - currently making users over firebase



    - Firebase expensive and clunky
