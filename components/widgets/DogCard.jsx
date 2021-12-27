import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Image } from "react-native";

import {
  Box,
  Heading,
  AspectRatio,
  Text,
  Center,
  Stack,
  HStack,
  VStack,
  IconButton,
  Button,
  Modal,
  FormControl,
  Input,
  TextArea,
} from "native-base";

import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { markLost, markFound } from "../../database";


export default function DogCard(props) {

  const [showAlertModal, setShowAlertModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)

  const [EContact, setEContact] = useState();
  const [message, setMessage] = useState();

  let uid = useSelector((state) => state.user.uid);

  useEffect(() => {
    // dog card loaded

  }, []);

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
      <Modal isOpen={showAlertModal} onClose={() => setShowAlertModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header colorScheme='red.500'>Mark Dog as Lost?</Modal.Header>
          <Modal.Body>

            <FormControl isRequired >
              <FormControl.Label>Add Alert Details</FormControl.Label>
              <TextArea onChangeText={(value) => setMessage(value)} />

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
      <Modal isOpen={showCancelModal} onClose={() => setShowCancelModal(false)}>
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
        <HStack w="100%">
          <Center w="25%">
            <AspectRatio w="115%" ratio={9 / 9}>
              <Image
                source={{
                  uri: props.dog.item.profileImage,
                }}
                alt="image"
              />
            </AspectRatio>
          </Center>
          <Box w="55%" ml='3'>
            <Stack p="4" space={2}>
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
                mt="-1"
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
                        _icon={{
                          as: MaterialIcons,
                          name: "edit",
                          size: 'sm',
                        }}
                      />
                    </Box>
                  </Box>
                }
                {(props.dog.item.owner !== uid) &&
                  <Box>
                    <Box>
                      <IconButton
                        _icon={{
                          as: MaterialCommunityIcons,
                          name: "eye",
                          size: 'sm',
                        }}
                      />
                    </Box>
                  </Box>
                }


              </VStack>
            </Center>
          </Box>
        </HStack>
      </Box>
    </Center>
  );
}
