import React  from 'react';
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
    Heading,
    FlatList
} from "native-base"
import { signOutUser } from '../../database';


export default function ProfileTab({ navigation }) {

    const dogCards = useSelector((state) => state.user.dogCards)


    return (
        <Box m='3'>
            {/* add dog card for each  */}

            <FlatList data={dogCards} renderItem={(dog) => (
                <Box my='1'>
                    <DogCard dog={dog} />

                </Box>
            )
            }
                keyExtractor={(dog) => dog.$id}
            />
            <Button mt="5" colorScheme="indigo" variant="outline" onPress={() => navigation.navigate("DogCreator")}> + Add Dog </Button>

            <Button colorScheme="orange" mt='4' _text={{ color: 'white' }} onPress={() => signOutUser()} > Sign Out</Button>

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
