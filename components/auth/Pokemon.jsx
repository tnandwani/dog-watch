import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  Box,
  AspectRatio,
  Heading,
  VStack,
  Center,
  ScrollView,
  Button,
  HStack,
  IconButton,
  Badge,
  Image,
  Icon,
  Text,
  FormControl,
  Slider,
  Switch,
} from 'native-base';
import { FontAwesome5 } from '@expo/vector-icons';

export default function Login({ navigation }) {


  // dog info
  let dog = {
    gender: 'male',
    sn: true,
  }

  const [sex, setSex] = useState({
    gender: "Male",
    color: 'darkBlue',
    fixed: "Not Fixed"
  });
  


  useEffect(() => { 

    // updaters 
    if (dog.gender !== 'male') {
      setSex({
        gender: "Female",
        color: 'pink'
      });
    }
    if (dog.sn) {
      setSex({
        
        fixed: "Fixed"
      });
    }

  }, []);




  return (
    <Box bg='coolGray.200' w='100%' h='100%' safeArea>
      <VStack mx='5' space={2}>
        <Center>
          <HStack w='100%' space='5'>
            <Box>
              <Heading size='2xl'>Milo</Heading>
            </Box>

            <Center>
              <HStack space='3'>
                <Badge colorScheme='indigo'>Poodle</Badge>
                <Badge colorScheme='indigo'>5 Years Old</Badge>
                {/* <Badge colorScheme='indigo'>{se.fixed}</Badge> */}

                <Badge colorScheme={sex.color}>{sex.gender}</Badge>



              </HStack>

            </Center>
          </HStack>

        </Center>

        <Center>
          <AspectRatio w='100%' ratio={1}>
            <Image
              rounded='lg'
              source={{
                uri: "https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_4x3.jpg"
              }}
              alt="image"
            />
          </AspectRatio>
        </Center>

        <Box >
          <VStack space={2}>
            <Center borderRadius="md" borderWidth={2} borderColor="indigo.400" borderStyle='dotted'>
              <Heading size='xs'>Biography</Heading>
              <Text fontWeight='thin'>tell me a story please</Text>
            </Center>
            <ScrollView>


              <FormControl>
                <FormControl.Label
                  _text={{ color: 'muted.700', fontSize: 'xs', fontWeight: 500 }}>
                  Good with people
                </FormControl.Label>
                <Slider
                  value={50}
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
                  value={60}
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
                  value={30}
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
                  value={20}
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
                  value={5}
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
                <Switch colorScheme="indigo" size="sm" isChecked={60} />
              </FormControl>
            </ScrollView>
          </VStack>

        </Box>
      </VStack>

    </Box>

  )
}
