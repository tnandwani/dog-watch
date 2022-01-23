import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Keyboard } from "react-native";
import { sendFeedback } from "../../database";
// UI 
import {
  Box,
  Button,
  Popover,
  HStack,
  Icon,
  Center,
  Heading,
  TextArea,
  Switch,
  useToast,
  FormControl,
} from "native-base"

import { Ionicons } from "@expo/vector-icons"

export default function Feedback(props) {
  useEffect(() => { }, []);
  const initialFocusRef = React.useRef(null)
  let [message, setMessage] = useState(null)
  let [suggestion, setSuggestion] = useState(true)
  const toast = useToast()

  return (
    <Popover
      initialFocusRef={initialFocusRef}
      trigger={(triggerProps) => {
        return <Button
          leftIcon={<Icon as={Ionicons} name="paw" size="sm" />}
          endIcon={<Icon as={Ionicons} name="paw" size="sm" />}
          colorScheme="indigo"
          {...triggerProps}
        >
          Send Feedback
        </Button>
      }}
    >
      <Popover.Content width="56">
        <Popover.Arrow />
        <Popover.CloseButton />

        <Popover.Header>Send Feedback</Popover.Header>
        <Popover.Body>
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
        </Popover.Body>
        <Popover.Footer>
          <Button.Group>
            <Button colorScheme="indigo" onPress={() => {
              sendFeedback(suggestion, message); 
              toast.show({
                description: "Thanks for the Feedback!",
                mb: '3'
              })
            }}>Send</Button>
          </Button.Group>
        </Popover.Footer>
      </Popover.Content>
    </Popover>
  );
}
