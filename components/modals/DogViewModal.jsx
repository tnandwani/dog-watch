import React, {  } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  VStack,
  Text,
  FormControl,
  Slider,
  Box,
  Icon,
  Switch,
  Modal,
} from 'native-base';
// ICONS
import { FontAwesome5 } from '@expo/vector-icons';

import { updateShowDogModal } from "../../redux/slices/interfaceSlice";

export default function DogViewModal(props) {

  const dispatch = useDispatch()


  let dogView = useSelector((state) => state.explore.dogView);
  let showDogModal = useSelector((state) => state.interface.modals.showDogModal);

  return (
    <Modal isOpen={showDogModal} onClose={() => dispatch(updateShowDogModal(false))}>
      {dogView &&
        <Modal.Content maxWidth="500px">
          <Modal.CloseButton />
          <Modal.Header colorScheme='emerald.500'>{dogView.dogName}</Modal.Header>
          <Modal.Body>
            <Box flex={1} p={3} >

              <VStack space={3}>

                <FormControl>
                  <FormControl.Label
                    _text={{ color: 'muted.700', fontSize: 'xs', fontWeight: 500 }}>
                    Good with people
                  </FormControl.Label>
                  <Slider
                    value={dogView.personality.people}
                    colorScheme='indigo'
                    minValue={0}
                    maxValue={100}
                    accessibilityLabel="hello world"
                    step={10}
                  >
                    <Slider.Track>
                      <Slider.FilledTrack />
                    </Slider.Track>
                    <Slider.Thumb borderWidth="0" bg="transparent">
                      <Icon as={FontAwesome5} name="dog" color="black" size="sm" />
                    </Slider.Thumb>
                  </Slider>

                </FormControl>
                <FormControl>
                  <FormControl.Label
                    _text={{ color: 'muted.700', fontSize: 'xs', fontWeight: 500 }}>
                    Good with other dogs
                  </FormControl.Label>
                  <Slider
                    value={dogView.personality.otherDogs}
                    colorScheme='indigo'
                    minValue={0}
                    maxValue={100}
                    accessibilityLabel="hello world"
                    step={10}
                  >
                    <Slider.Track>
                      <Slider.FilledTrack />
                    </Slider.Track>

                    <Slider.Thumb borderWidth="0" bg="transparent">
                      <Icon as={FontAwesome5} name="dog" color="black" size="sm" />
                    </Slider.Thumb>
                  </Slider>
                </FormControl>
                <FormControl>
                  <FormControl.Label
                    _text={{ color: 'muted.700', fontSize: 'xs', fontWeight: 500 }}>
                    Sharing Toys
                  </FormControl.Label>
                  <Slider
                    value={dogView.personality.sharing}
                    colorScheme='indigo'
                    minValue={0}
                    maxValue={100}
                    accessibilityLabel="hello world"
                    step={10}
                  >
                    <Slider.Track>
                      <Slider.FilledTrack />
                    </Slider.Track>
                    <Slider.Thumb borderWidth="0" bg="transparent">
                      <Icon as={FontAwesome5} name="dog" color="black" size="sm" />
                    </Slider.Thumb>
                  </Slider>
                </FormControl>
                <FormControl>
                  <FormControl.Label
                    _text={{ color: 'muted.700', fontSize: 'xs', fontWeight: 500 }}>
                    Energy
                  </FormControl.Label>
                  <Slider
                    value={dogView.personality.energy}
                    colorScheme='indigo'
                    minValue={0}
                    maxValue={100}
                    accessibilityLabel="hello world"
                    step={10}
                  >
                    <Slider.Track>
                      <Slider.FilledTrack />
                    </Slider.Track>

                    <Slider.Thumb borderWidth="0" bg="transparent">
                      <Icon as={FontAwesome5} name="dog" color="black" size="sm" />
                    </Slider.Thumb>
                  </Slider>
                </FormControl>
                <FormControl>
                  <FormControl.Label
                    _text={{ color: 'muted.700', fontSize: 'xs', fontWeight: 500 }}>
                    Training
                  </FormControl.Label>
                  <Slider
                    value={dogView.personality.training}
                    colorScheme='indigo'
                    minValue={0}
                    maxValue={100}
                    accessibilityLabel="hello world"
                    step={10}
                  >
                    <Slider.Track>
                      <Slider.FilledTrack />
                    </Slider.Track>

                    <Slider.Thumb borderWidth="0" bg="transparent">
                      <Icon as={FontAwesome5} name="dog" color="black" size="sm" />
                    </Slider.Thumb>
                  </Slider>
                </FormControl>

                <FormControl>
                  <FormControl.Label
                    _text={{ color: 'muted.700', fontSize: 'xs', fontWeight: 500 }}>
                    Spay or Neutered?
                  </FormControl.Label>
                  <Switch colorScheme="indigo" size="sm" isChecked={dogView.personality.sn} />
                </FormControl>
                <FormControl>
                  <FormControl.Label
                    _text={{ color: 'muted.700', fontSize: 'xs', fontWeight: 500 }}>
                    Biography
                  </FormControl.Label>
                  <Text>{dogView.personality.bio}</Text>
                </FormControl>

              </VStack>


            </Box>

          </Modal.Body>

        </Modal.Content>
      }

    </Modal>
  );
}
