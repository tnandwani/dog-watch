import React from 'react';
import firebase from 'firebase';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import DogCard from './components/DogCard'


// UI 
import {
    Box,
    Button,
    Center,
    VStack,
    Flex,
    Spacer,
    Divider,
    Heading
} from "native-base"


export default function ProfileTab({ navigation }) {
    return (
        <Box m='3'>
            <DogCard />
            <Button mt="5" height='20%' colorScheme="indigo" variant="outline" onPress={() => navigation.navigate("DogCreator")}> + Add Dog </Button>

            <Button my="3" colorScheme="indigo" _text={{ color: 'white' }} shadow="7"   > Join Neighborhood </Button>

            <Divider my='5' thickness= '2'/>
            <Heading >Resources</Heading>
            <VStack w='100%' mt='3'>
                <Flex
                    direction="row"

                    mb="2.5"
                    mt="1.5"
                    _text={{
                        color: "coolGray.800",
                    }}
                >

                    <Center w='48%' h='20' bg="tertiary.500" rounded='lg' shadow='5'>
                        300
                    </Center>
                    <Spacer />

                    <Center w='48%' h='20' bg="primary.800" rounded='lg' shadow='5'>
                        400
                    </Center>
                </Flex>
                <Flex
                    direction="row"

                    mb="2.5"
                    mt="1.5"
                    _text={{
                        color: "coolGray.800",
                    }}
                >

                    <Center w='48%' h='20' bg="purple.800" rounded='lg' shadow='5'>
                        300
                    </Center>
                    <Spacer />

                    <Center w='48%' h='20' bg="danger.300" rounded='lg' shadow='5'>
                        400
                    </Center>
                </Flex>


            </VStack>

        </Box>
    )
}
