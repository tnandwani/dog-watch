import React, { useState, useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import { Keyboard, Platform, KeyboardAvoidingView } from "react-native";
import { sendFeedback } from "../../database";
// UI 
import {
  Box,
  Button,
  Popover,
  HStack,
  Modal,
  Icon,
  Center,
  Heading,
  TextArea,
  Switch,
  useDisclose,
  useToast,
  FormControl,
} from "native-base"

import { Ionicons } from "@expo/vector-icons"
import { updateShowFeedback } from "../../redux/slices/interfaceSlice";

export default function Feedback(props) {
  useEffect(() => { }, []);
  const initialFocusRef = React.useRef(null)
  let [message, setMessage] = useState(null)
  let [suggestion, setSuggestion] = useState(true)
  let [popOpen, setPopOpen] = useState(false)

  const toast = useToast()
  let showFeedbackModal = useSelector((state) => state.interface.modals.showFeedback);

  const dispatch = useDispatch()

  return (

    <Modal isOpen={showFeedbackModal} avoidKeyboard onClose={() => dispatch(updateShowFeedback(false))}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Header colorScheme='emerald.500'>Send Feedback</Modal.Header>
        <Modal.Body>
          <FormControl>
            <Center>

              <HStack>
                <Heading size={'sm'} fontWeight={'light'}>Issue</Heading>
                <Switch mx={3} colorScheme="indigo" isChecked={suggestion} onToggle={(v) => { setSuggestion(v) }} />
                <Heading size={'sm'} fontWeight={'light'}>Suggestion</Heading>


              </HStack>
            </Center>


          </FormControl>
          <FormControl mt="3">
            <FormControl.Label
              _text={{
                fontSize: "xs",
                fontWeight: "medium",
              }}
            >
              Feedback is always welcome!
            </FormControl.Label>
            <TextArea
              h={20}
              placeholder="Tell us how we can be better!"
              onSubmitEditing={() => Keyboard.dismiss()}
              onChangeText={(v) => { setMessage(v) }}
            />
          </FormControl>
        </Modal.Body>
        <Modal.Footer>
          <Button.Group>
            <Button colorScheme="indigo" variant='outline' onPress={() => {
              dispatch(updateShowFeedback(false))
            }}>Cancel</Button>
            <Button colorScheme="indigo" onPress={() => {
              sendFeedback(suggestion, message);
              toast.show({
                description: "Thanks for the Feedback!",
                mb: '3'
              })
              dispatch(updateShowFeedback(false))
            }}>Send</Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>

  );
}
