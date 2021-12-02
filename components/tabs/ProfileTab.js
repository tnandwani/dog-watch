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
    Divider

} from "native-base"


export default function ProfileTab() {
    return (
        <Box mt="2">
            <Heading ml="5" size="2xl">Profile</Heading>

            <VStack mt='2'>
                <Box mx = '5'>
                    <DogCard />
                </Box>

                <Button m="5" h="40" colorScheme="indigo" variant="outline" > + Add Dog </Button>

                <Button m="5" mt="1" colorScheme="indigo" _text={{ color: 'white' }}  > Verify Location </Button>

            </VStack>


            <Divider my="2" />

            <Heading ml='5'>Resources</Heading>

            <Center my="5">

                <VStack space={4} alignItems="center">
                    <HStack space={3} alignItems="center">
                        <Center h="20" w="45vw" bg="primary.500" rounded="md" shadow={3} > Training </Center>
                        <Center h="20" w="45vw" bg="fuchsia.400" rounded="md" shadow={3} > Diet </Center>
                    </HStack>
                    <HStack space={3} alignItems="center">
                        <Center h="20" w="45vw" bg="tertiary.400" rounded="md" shadow={3} > Healthcare </Center>
                        <Center h="20" w="45vw" bg="info.600" rounded="md" shadow={3} > Meetups? </Center>
                    </HStack>

                </VStack>


            </Center>



            <Button m="5" mt="1" colorScheme="orange" _text={{ color: 'white' }} onPress={() => firebase.auth().signOut()} > Sign Out</Button>




        </Box>

    )
}
