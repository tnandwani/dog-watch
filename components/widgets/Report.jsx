import React, { useEffect } from "react";
import { reportUser } from "../../database";
// UI 
import {
  Button,
  Popover,
  IconButton,
  useToast,
} from "native-base"

import { MaterialIcons } from '@expo/vector-icons';

export default function Report(props) {
  useEffect(() => { }, []);
  const initialFocusRef = React.useRef(null)

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
