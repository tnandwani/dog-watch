import React from 'react';
import firebase from 'firebase';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import DogCard from './components/DogCard'


// UI 
import {
    Box,
    Button,
    Center,
    HStack,
    VStack,
    Heading,
    Stack,
    Divider,
    Container

} from "native-base"


export default function ProfileTab({ navigation }) {
    return (
        <Box mt="2">
            <VStack mt='2'>
                <Box mx='5'>
                    <DogCard />
                </Box>

                <Button m="5" height='20%' colorScheme="indigo" variant="outline" onPress={() => navigation.navigate("DogCreator")}> + Add Dog </Button>

                <Button m="5" mt="1" colorScheme="indigo" _text={{ color: 'white' }} shadow="7"   > Join Neighborhood </Button>

            </VStack>


            <Divider my="5" thickness="2" />

            <Heading ml='5'>Resources</Heading>

            <HStack space={3} alignItems="center">
                <Center h="40" w="20" bg="primary.500" rounded="md" shadow={3} />
                <Center h="40" w="20" bg="emerald.500" rounded="md" shadow={3} />
            </HStack>




            <Button m="5" mt="1" colorScheme="orange" _text={{ color: 'white' }} onPress={() => firebase.auth().signOut()} > Sign Out</Button>




        </Box>

    )
}
