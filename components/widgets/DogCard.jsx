import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Image, Keyboard } from "react-native";
import Report from "./Report";
import {
  Box,
  Heading,
  AspectRatio,
  Text,
  Pressable,
  Badge,
  Center,
  Skeleton,
  Stack,
  HStack,
  VStack,
  Icon,
  IconButton,
  Button,
  Modal,
  FormControl,
  Input,
  TextArea,
} from "native-base";

import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { markLost, markFound, viewDog, reportUser, sendFireError } from "../../database";
import { updateDogView, updateShowDogModal } from "../../redux/slices/exploreSlice";
import { importDog } from "../../redux/slices/rawDogSlice";

export default function DogCard(props) {

  const dispatch = useDispatch()

  const [showAlertModal, setShowAlertModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showDogModal, setShowDogModal] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false);
  const [EContact, setEContact] = useState();
  const [message, setMessage] = useState();
  const [profileImage, setProfileImage] = useState(props.dog.item.profileImage);

  let uid = useSelector((state) => state.user.uid);
  let email = useSelector((state) => state.user.email);

  let dogView = useSelector((state) => state.explore.dogView);

  useEffect(() => {
    // dog card loaded

  }, []);


  const editDog = () => {
    // pass dog to rawDog
    dispatch(importDog(props.dog.item))

    // open Dog Creator 
    props.navigation.navigate('DogCreator')




  }

  const confirm = () => {
    // update db 
    markLost(props.dog.item, EContact, props.dog.index, message);
    // close modal
    setShowAlertModal(false)
  }

  const cancelAlert = () => {
    // update db 
    markFound(props.dog.item, props.dog.index);
    // close modal
    setShowCancelModal(false)
  }

  return (
    <Center w="100%">

      {/* TURN ALERT ON */}
      <Modal isOpen={showAlertModal} avoidKeyboard onClose={() => setShowAlertModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header colorScheme='red.500'>Mark Dog as Lost?</Modal.Header>
          <Modal.Body>

            <FormControl isRequired >
              <FormControl.Label>Add Alert Details</FormControl.Label>
              <TextArea
                onSubmitEditing={() => Keyboard.dismiss()}
                onChangeText={(value) => setMessage(value)} />

            </FormControl>
            <FormControl isRequired mt='2'>
              <FormControl.Label>Emergency Contact</FormControl.Label>
              <Input onChangeText={(value) => setEContact(value)} />
              <FormControl.HelperText>
                Are you sure you want to mark your dog as lost?
              </FormControl.HelperText>
            </FormControl>

          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="outline"
                colorScheme="indigo"
                onPress={() => {
                  setShowAlertModal(false)
                }}
              >
                Cancel
              </Button>
              <Button
                colorScheme="error"
                onPress={() => {
                  confirm();
                }}
              >
                Confirm
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      {/* TURN ALERT OFF */}
      <Modal isOpen={showCancelModal} avoidKeyboard onClose={() => setShowCancelModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header colorScheme='emerald.500'>Mark Dog as Found?</Modal.Header>
          <Modal.Body>
            <FormControl>
              <FormControl.HelperText>
                Are you sure you want to mark your dog as found?
              </FormControl.HelperText>
            </FormControl>

          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="outline"
                colorScheme="indigo"
                onPress={() => {
                  setShowCancelModal(false)
                }}
              >
                Close
              </Button>
              <Button
                colorScheme="emerald"
                onPress={() => {
                  cancelAlert();
                }}
              >
                Cancel Alert
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      {/* Dog CARD */}
      <Box
        w="100%"
        rounded="lg"
        overflow="hidden"
        borderColor="coolGray.200"
        _dark={{
          borderColor: "coolGray.600",
          backgroundColor: "gray.700",
        }}
        _web={{
          shadow: 7,
          borderWidth: 0,
        }}
        _light={{
          backgroundColor: "gray.50",
        }}
      >
        <Pressable onPress={() => viewDog(props.dog.item)}>

          <HStack w="100%">
            <Center w="25%">
              <Skeleton isLoaded={isLoaded} flex="1" h="100" w="100%" rounded="md" startColor="indigo.400">

                <AspectRatio w="115%" ratio={9 / 9}>
                  <Image
                    fai
                    onLoadEnd={() => setIsLoaded(true)}
                    w='100%'
                    source={{
                      uri: profileImage,
                      // uri: "https://i.ytimg.com/vi/MPV2METPeJU/maxresdefault.jpg",
                    }}
                    alt="image"
                  />


                </AspectRatio>
              </Skeleton>

            </Center>
            <Box w="55%" ml='3'>
              <Stack p="4" space={1}>
                <Heading size="md" ml="-1">

                  {props.dog.item.dogName}

                </Heading>
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
                >

                  {props.dog.item.breed}
                </Text>

                <Text
                  color="coolGray.600"
                  _dark={{
                    color: "warmGray.200",
                  }}
                  fontWeight="300"
                >

                  {props.dog.item.age + " Years Old"}

                  {/* gender icon */}
                  {props.dog.item.gender === 'F' &&
                    <Icon ml='1' as={MaterialCommunityIcons} name="gender-female" color="pink.400" size="xs" />
                  }
                  {props.dog.item.gender === 'M' &&
                    <Icon ml='1' as={MaterialCommunityIcons} name="gender-male" color="blue.400" size="xs" />
                  }
                </Text>
              </Stack>
            </Box>
            <Box w="20%" mr='3' mt='2'>
              <Center>
                <VStack space={5} >

                  {(props.dog.item.owner === uid) &&
                    <Box>
                      {/* IF DOG NOT LOST */}
                      {(!props.dog.item.lost) &&
                        <Box>
                          <IconButton
                            onPress={() => setShowAlertModal(true)}
                            _icon={{
                              as: MaterialCommunityIcons,
                              name: "bell-alert",
                              size: 'sm',
                              color: 'red.400'
                            }}
                          />
                        </Box>
                      }
                      {/* IF LOST DOG */}
                      {(props.dog.item.lost) &&
                        <Box>
                          <IconButton
                            onPress={() => setShowCancelModal(true)}
                            _icon={{
                              as: MaterialCommunityIcons,
                              name: "bell-cancel",
                              size: 'sm',
                              color: 'emerald.400'
                            }}
                          />
                        </Box>
                      }


                      <Box>
                        <IconButton
                          onPress={() => editDog()}
                          _icon={{
                            as: MaterialIcons,
                            name: "edit",
                            size: 'sm',
                          }}
                        />
                      </Box>
                    </Box>
                  }
                  {(props.dog.item.owner !== uid && email) &&
                    <Box>
                      <Report dog={props.dog.item} />
                    </Box>
                  }



                </VStack>
              </Center>
            </Box>
          </HStack>
        </Pressable>

      </Box>
    </Center>
  );
}
