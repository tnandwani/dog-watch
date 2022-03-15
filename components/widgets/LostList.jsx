import React, { useState } from 'react';
import { useSelector } from "react-redux";

import { Linking, Alert, Platform } from 'react-native';

import {
	Box,
	Text,
	Pressable,
	Icon,
	HStack,
	useToast,
	Avatar,
	VStack,
} from 'native-base';
import { SwipeListView } from 'react-native-swipe-list-view';
import { MaterialIcons } from '@expo/vector-icons';
import { reportUser, sendFireError, viewDog } from '../../database';

export default function LostList() {

	let lostData = useSelector((state) => state.explore.myZone.lost);
	let uid = useSelector((state) => state.user.uid);

	const [listData, setListData] = useState(lostData);
	const toast = useToast()

	const closeRow = (rowMap, rowKey) => {
		if (rowMap[rowKey]) {
			rowMap[rowKey].closeRow();
		}
	};

	const report = (rowMap, rowKey, data) => {
		const reportedDog = data.item;

		if (reportedDog.owner === uid) {
			alert("Can't report yourself. Kinda sus.")
		} else {
			reportUser(reportedDog)

			// remove card 
			closeRow(rowMap, rowKey);
			const newData = [...listData];
			const prevIndex = listData.findIndex((item) => item.key === rowKey);
			newData.splice(prevIndex, 1);
			setListData(newData);
			toast.show({
				description: "User has been reported!",
				mb: '3'
			})
		}

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
			.catch(err => sendFireError(err, "Linking.error"));

	};

	const onRowDidOpen = (rowKey) => {
	};

	const renderItem = ({ item, index }) => (
		<Box>
			<Pressable onPress={() => viewDog(item)} bg="#F9FAFB">
				<Box
					px={1}
					py={3}
				>
					<HStack space={3}>
						<Avatar size='xl' source={{ uri: item.profileImage }} />
						<Box alignSelf="flex-start">
							<VStack space={1}>
								<Text _light={{
									color: "violet.500",
								}}
									_dark={{
										color: "violet.400",
									}}
									fontSize='md'
									bold>
									{item.dogName}
								</Text>
								<Text fontSize="xs" color="red.400" _dark={{ color: 'red.400' }} alignSelf="flex-start">
									{"Lost On: " + item.alert.date}
								</Text>

								<Text fontSize='xs' color="coolGray.600" _dark={{ color: 'warmGray.200' }}>{item.alert.message}</Text>

							</VStack>
						</Box>
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
