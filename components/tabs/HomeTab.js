import React from 'react';
import {
    Box,
    FlatList,
    Heading,
    Avatar,
    HStack,
    VStack,
    Text,
    AspectRatio,
    Image,
    Icon,
    IconButton,
    ScrollView,
} from "native-base"

import { MaterialIcons } from '@expo/vector-icons';

export default function HomeTab() {

    const data = [
        {
            id: "bd7acbea-c1b1-46c2-aed5-3adghj53abb28ba",
            fullName: "Dog Name",
            timeStamp: "12:47 PM",
            recentText: "Good Day!",
            avatarUrl:
                "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
            post: "https://post.healthline.com/wp-content/uploads/2020/08/3180-Pug_green_grass-1200x628-FACEBOOK-1200x628.jpg"
        },
        {
            id: "3ac44468afc-c605-48d3-a4f8-fbd91jjaa97f63",
            fullName: "Dog Name",
            timeStamp: "11:11 PM",
            recentText: "Cheer up, there!",
            avatarUrl:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyEaZqT3fHeNrPGcnjLLX1v_W4mvBlgpwxnA&usqp=CAU",
            post: false
        },
        {
            id: "bd7acbea-c1b1-46c2-aed5-3adkj53abb28ba",
            fullName: "Dog Name",
            timeStamp: "12:47 PM",
            recentText: "Good Day!",
            avatarUrl:
                "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
            post: "https://post.healthline.com/wp-content/uploads/2020/08/3180-Pug_green_grass-1200x628-FACEBOOK-1200x628.jpg"
        },
        {
            id: "bd7acbfdea-c1b1-46c2-aed5-3ad53abb28ba",
            fullName: "Dog Name",
            timeStamp: "12:47 PM",
            recentText: "Good Day!",
            avatarUrl:
                "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
            post: "https://post.healthline.com/wp-content/uploads/2020/08/3180-Pug_green_grass-1200x628-FACEBOOK-1200x628.jpg"
        },
        {
            id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
            fullName: "Dog Name",
            timeStamp: "11:11 PM",
            recentText: "Cheer up, there!",
            avatarUrl:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTyEaZqT3fHeNrPGcnjLLX1v_W4mvBlgpwxnA&usqp=CAU",
            post: false
        },
        {
            id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
            fullName: "Dog Name",
            timeStamp: "12:47 PM",
            recentText: "Good Day!",
            avatarUrl:
                "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
            post: "https://post.healthline.com/wp-content/uploads/2020/08/3180-Pug_green_grass-1200x628-FACEBOOK-1200x628.jpg"
        },

    ]
    return (

        <Box>
            <Heading fontSize="xl" p="4" pb="3">
                Your Neighborhood
            </Heading>
            {/* <FlatList
                data={data}
                renderItem={({ item }) => (
                    <Box
                        borderBottomWidth="1"
                        _dark={{
                            borderColor: "gray.600",
                        }}
                        borderColor="coolGray.200"
                        pl="4"
                        pr="5"
                        py="2"
                    >
                        <HStack space={3}>
                            <VStack>
                                <Avatar
                                    size="48px"
                                    source={{
                                        uri: item.avatarUrl,
                                    }}
                                />
                               
                            </VStack>

                            <VStack w='90%'>
                                <Text
                                    _dark={{
                                        color: "warmGray.50",
                                    }}
                                    color="coolGray.800"
                                    bold
                                >
                                    {item.fullName}
                                </Text>
                                <Text
                                    color="coolGray.600"
                                    _dark={{
                                        color: "warmGray.200",
                                    }}
                                >
                                    {item.recentText}
                                </Text>
                                <Box w='90%' mr='' mt='3'>
                                    {item.post && <AspectRatio>
                                        <Image
                                            rounded={10}
                                            source={{
                                                uri: item.post,
                                            }}
                                            alt="image"
                                        />
                                    </AspectRatio>}


                                </Box>
                                <HStack space='4'>
                                <IconButton
                                    mt='2'
                                    borderRadius="full"
                                    bg='red.400'
                                    variant="solid"
                                    p="3"
                                    icon={
                                        <Icon color="white" name='thumb-up' as={MaterialIcons} size="sm" />
                                    }
                                />
                                <IconButton
                                    mt='2'
                                    borderRadius="full"
                                    bg='info.400'
                                    variant="solid"
                                    p="3"
                                    icon={
                                        <Icon color="white" name='comment' as={MaterialIcons} size="sm" />
                                    }
                                />
                                <IconButton
                                    mt='2'
                                    borderRadius="full"
                                    bg='purple.500'
                                    variant="solid"
                                    p="3"
                                    icon={
                                        <Icon color="white" name='share' as={MaterialIcons} size="sm" />
                                    }
                                />
                                </HStack>

                            </VStack>

                        </HStack>
                    </Box>
                )}
                keyExtractor={(item) => item.id}
            /> */}
        </Box>

    );
}
