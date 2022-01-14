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
import { MaterialIcons } from '@expo/vector-icons';
import { reportUser } from '../../database';

export default function LostList() {

	let lostData = useSelector((state) => state.explore.myZone.lost);

	const [listData, setListData] = useState(lostData);

	const closeRow = (rowMap, rowKey) => {
		if (rowMap[rowKey]) {
			rowMap[rowKey].closeRow();
		}
	};

	const report = (rowMap, rowKey, data) => {
		const reportedDog = data.item.dog;

		console.log("reported duid", reportedDog)
		reportUser(reportedDog)

		// remove card 
		closeRow(rowMap, rowKey);
		const newData = [...listData];
		const prevIndex = listData.findIndex((item) => item.key === rowKey);
		newData.splice(prevIndex, 1);
		setListData(newData);
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
			<Pressable onPress={() => alert('You touched me')} bg="#F9FAFB">
				<Box
					px={1}
					py={3}
				>
					<HStack alignItems="center" space={3}>
						<Avatar size="80px" source={{ uri: item.dog.profileImage }} />
						<VStack space={1}>
							<Text
								fontSize="lg"
								color="coolGray.800"
								_dark={{ color: 'warmGray.50' }} bold>
								{item.dog.dogName}
							</Text>
							<Text
								fontSize="sm"
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
							<Text
								color="coolGray.600"
								_dark={{
									color: "warmGray.200",
								}}
								fontWeight="300"
							>

								{"Lost on: " + item.date}
							</Text>
						</VStack>
						<Spacer />

					</HStack>
				</Box>
			</Pressable>
		</Box >
	);

	const renderHiddenItem = (data, rowMap) => (

		<HStack flex="1" pl="2">
			<Pressable
				w="70"
				ml="auto"
				bg="red.400"
				justifyContent="center"
				onPress={() => report(rowMap, data.item.key, data)}
				_pressed={{
					opacity: 0.5,
				}}>
				<VStack alignItems="center" space={2}>
					<Icon
						as={<MaterialIcons name="report" />}
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
				bg="success.500"
				justifyContent="center"
				onPress={() => callDog(rowMap, data.item.key, data.item.contact)}
				_pressed={{
					opacity: 0.5,
				}}>
				<VStack alignItems="center" space={2}>
					<Icon as={<MaterialIcons name="phone" />} color="white" size="xs" />
					<Text color="white" fontSize="xs" fontWeight="medium">
						Call
					</Text>
				</VStack>
			</Pressable>
		</HStack>
	);

	return (
		<Box flex="1" py='1'>
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
