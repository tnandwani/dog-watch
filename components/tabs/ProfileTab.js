import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DogCard from './components/DogCard'
import { useSelector, useDispatch } from 'react-redux'


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
import { signOutUser } from '../../database';


export default function ProfileTab({ navigation }) {


    return (
        <Box m='3'>
            <DogCard />
            <Button mt="5" height='20%' colorScheme="indigo" variant="outline" onPress={() => navigation.navigate("DogCreator")}> + Add Dog </Button>

            <Button my="4" colorScheme="indigo" _text={{ color: 'white' }} shadow="7"   > Join Neighborhood </Button>
            <Button  colorScheme="orange" _text={{ color: 'white' }} onPress={() => signOutUser()} > Sign Out</Button>

            <Divider my='5' thickness='2' />
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

                    <Center w='48%' h='20' bg="amber.400" rounded='lg' _text={{ color: 'white' }} shadow='5'>
                        <MaterialCommunityIcons name="dog-service" size={24} color="white" />
                        Training
                    </Center>
                    <Spacer />

                    <Center w='48%' h='20' bg="danger.400" rounded='lg' _text={{ color: 'white' }} shadow='5'>
                        <MaterialCommunityIcons name="stethoscope" size={24} color="white" />
                        Health
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
                        <MaterialCommunityIcons name="food-apple" size={24} color="white" />
                        Diet
                    </Center>
                    <Spacer />

                    <Center w='48%' h='20' bg="tertiary.500" rounded='lg' shadow='5'>
                        <MaterialIcons name="park" size={24} color="white" />
                        Parks
                    </Center>
                </Flex>


            </VStack>


        </Box>
    )
}
