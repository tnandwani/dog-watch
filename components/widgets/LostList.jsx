import React, { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";

import { Linking, Alert, Platform } from 'react-native';

import {
    NativeBaseProvider,
    Box,
    Text,
    Pressable,
    Heading,
    IconButton,
    Icon,
    HStack,
    Avatar,
    VStack,
    Spacer,
} from 'native-base';
import { SwipeListView } from 'react-native-swipe-list-view';
import { MaterialIcons, Ionicons, Entypo } from '@expo/vector-icons';

export default function LostList() {
    const data = [
        {
            id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
            fullName: 'Afreen Khan',
            timeStamp: '12:47 PM',
            recentText: 'Good Day!',
            avatarUrl:
                'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
        },
        {
            id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
            fullName: 'Sujita Mathur',
            timeStamp: '11:11 PM',
            recentText: 'Cheer up, there!',
            avatarUrl:
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyEaZqT3fHeNrPGcnjLLX1v_W4mvBlgpwxnA&usqp=CAU',
        },
        {
            id: '58694a0f-3da1-471f-bd96-145571e29d72',
            fullName: 'Anci Barroco',
            timeStamp: '6:22 PM',
            recentText: 'Good Day!',
            avatarUrl: 'https://miro.medium.com/max/1400/0*0fClPmIScV5pTLoE.jpg',
        },
        {
            id: '68694a0f-3da1-431f-bd56-142371e29d72',
            fullName: 'Aniket Kumar',
            timeStamp: '8:56 PM',
            recentText: 'All the best',
            avatarUrl:
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr01zI37DYuR8bMV5exWQBSw28C1v_71CAh8d7GP1mplcmTgQA6Q66Oo--QedAN1B4E1k&usqp=CAU',
        },
        {
            id: '28694a0f-3da1-471f-bd96-142456e29d72',
            fullName: 'Kiara',
            timeStamp: '12:47 PM',
            recentText: 'I will call today.',
            avatarUrl:
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBwgu1A5zgPSvfE83nurkuzNEoXs9DMNr8Ww&usqp=CAU',
        },
    ];

    let lostData = useSelector((state) => state.explore.myZone.lost);

    const [listData, setListData] = useState(lostData);

    const report = (rowMap, rowKey) => {
        alert("reported")

    };

    const callDog = (rowMap, rowKey, phone) => {

        let phoneNumber = phone;

        if (Platform.OS !== 'android') {
            phoneNumber = `telprompt:${phone}`;
        }
        if (Platform.OS == 'web') {
            alert("Please Call: " + phone)
        }
        else {
            phoneNumber = `tel:${phone}`;
        }

        Linking.canOpenURL(phoneNumber)
            .then(supported => {
                if (!supported) {
                    Alert.alert('Phone number is not available');
                } else {
                    return Linking.openURL(phoneNumber);
                }
            })
            .catch(err => console.log(err));

    };

    const onRowDidOpen = (rowKey) => {
    console.log('This row opened', rowKey);
    };

    const renderItem = ({ item, index }) => (
    <Box>
            <Pressable onPress={() => console.log('You touched me')} bg="#F9FAFB">
                <Box
                    pl="4"
                    pr="5"
                    py="2"
                >
                    <HStack alignItems="center" space={3}>
                        <Avatar size="100px" source={{ uri: item.dog.profileImage }} />
                        <VStack>
                            <Text color="coolGray.800" _dark={{ color: 'warmGray.50' }} bold>
                                {item.dog.dogName}
                            </Text>
                            <Text
                                fontSize="xs"
                                _light={{
                                    color: "violet.500",
                                }}
                                _dark={{
                                    color: "violet.400",
                                }}
                                fontWeight="500"
                                ml="-0.5"
                                mt="-1"
                            >

                                {item.dog.breed}
                            </Text>
                            <Text color="coolGray.600" _dark={{ color: 'warmGray.200' }}>{item.message}</Text>
                        </VStack>
                        <Spacer />
                        <Text fontSize="xs" color="coolGray.800" _dark={{ color: 'warmGray.50' }} alignSelf="flex-start">
                            {item.date}
                        </Text>
                    </HStack>
                </Box>
            </Pressable>
    </Box>
    );

    const renderHiddenItem = (data, rowMap) => (
    <HStack flex="1" pl="2">
            <Pressable
                w="70"
                ml="auto"
                cursor="pointer"
                bg="coolGray.200"
                justifyContent="center"
                onPress={() => report(rowMap, data.item.key)}
                _pressed={{
                    opacity: 0.5,
                }}>
                <VStack alignItems="center" space={2}>
                    <Icon
                        as={<Entypo name="dots-three-horizontal" />}
                        size="xs"
                        color="coolGray.800"
                    />
                    <Text fontSize="xs" fontWeight="medium" color="coolGray.800">
                        Report
                    </Text>
                </VStack>
            </Pressable>
            <Pressable
                w="70"
                cursor="pointer"
                bg="red.500"
                justifyContent="center"
                onPress={() => callDog(rowMap, data.item.key, data.item.contact)}
                _pressed={{
                    opacity: 0.5,
                }}>
                <VStack alignItems="center" space={2}>
                    <Icon as={<MaterialIcons name="delete" />} color="white" size="xs" />
                    <Text color="white" fontSize="xs" fontWeight="medium">
                        Call
                    </Text>
                </VStack>
            </Pressable>
    </HStack>
    );

    return (
        <Box safeArea flex="1">
            <SwipeListView
                data={listData}
                renderItem={renderItem}
                renderHiddenItem={renderHiddenItem}
                rightOpenValue={-130}
                previewRowKey={'0'}
                previewOpenValue={-40}
                previewOpenDelay={3000}
                onRowDidOpen={onRowDidOpen}
            />
    </Box>
    );
}
