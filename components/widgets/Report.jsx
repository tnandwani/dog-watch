import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Keyboard } from "react-native";
import { reportUser, sendFeedback } from "../../database";
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
  IconButton,
  Switch,
  useToast,
  FormControl,
} from "native-base"

import { MaterialIcons } from '@expo/vector-icons';

export default function Report(props) {
  useEffect(() => { }, []);
  const initialFocusRef = React.useRef(null)
  let [message, setMessage] = useState(null)
  let [suggestion, setSuggestion] = useState(true)
  let [toggler, setToggler] = useState(false)
  const toast = useToast()

  console.log("reporting props", props);

  return (
    <Popover
      initialFocusRef={initialFocusRef}
      isOpen = {toggler}
      trigger={(triggerProps) => {
        return <IconButton
          onPress={() => reportUser(props.dog)}
          _icon={{
            as: MaterialIcons,
            name: "report",
            size: 'sm',
          }}
        />
      }}
    >
      <Popover.Content width="56">
        <Popover.Arrow />
        <Popover.CloseButton />
        {/* @ts-ignore */}
        <Popover.Header>Report User</Popover.Header>
        <Popover.Body>
        
        </Popover.Body>
        <Popover.Footer>
          <Button.Group>
            <Button colorScheme="indigo">Send</Button>
          </Button.Group>
        </Popover.Footer>
      </Popover.Content>
    </Popover>
  );
}
