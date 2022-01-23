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
  const toast = useToast()

  return (
    <Popover
      placement="left"
      initialFocusRef={initialFocusRef}
      trigger={(triggerProps) => {
        return <IconButton
          {...triggerProps}
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
        <Popover.Header>Report User?</Popover.Header>
        <Popover.Footer>
          <Button.Group>
            <Button
              onPress={() => {
                reportUser(props.dog)
                toast.show({
                  description: "User has been reported!",
                  mb: '3'
                })
              }}
              variant='outline' colorScheme="red">Confirm</Button>
          </Button.Group>
        </Popover.Footer>
      </Popover.Content>
    </Popover>
  );
}
