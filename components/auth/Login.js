import React, { useState } from 'react'
import {
    Box,
    Text,
    Heading,
    VStack,
    FormControl,
    Input,
    Link,
    Button,
    HStack
  } from 'native-base';
import { signInUser } from '../../database';



export default function Login({navigation}) {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [alert, setAlert] = useState("'Must be atleast 6 characters.'");


    return (
        <Box safeArea flex={1} p="2" py="8" w="90%" mx="auto">
            <Heading size="lg" fontWeight="600" color="coolGray.800">
              Welcome Back
            </Heading>
            <Heading mt="1" color="coolGray.600" fontWeight="medium" size="xs">
              Sign in to continue!
            </Heading>
    
            <VStack space={3} mt="5">
              <FormControl>
                <FormControl.Label
                  _text={{
                    color: 'coolGray.800',
                    fontSize: 'xs',
                    fontWeight: 500,
                  }}>
                  Email ID
                </FormControl.Label>
                <Input type = 'email' onChangeText={(value) => setEmail(value)}/>
              </FormControl>
              <FormControl>
                <FormControl.Label
                  _text={{
                    color: 'coolGray.800',
                    fontSize: 'xs',
                    fontWeight: 500,
                  }}>
                  Password
                </FormControl.Label> 
                <Input type="password" onChangeText={(value) => setPassword(value)}/>
                <FormControl.HelperText>
            {alert}
          </FormControl.HelperText>
                {/* <Link
                  _text={{ fontSize: 'xs', fontWeight: '500', color: 'indigo.500' }}
                  alignSelf="flex-end"
                  mt="1">
                  Forget Password?
                </Link> */}
              </FormControl>
              <Button mt="2" colorScheme="indigo"  onPress={() => signInUser(email, password)}>
                Sign in
              </Button>
              <Button mt="2" variant = "outline"colorScheme="indigo"  onPress= {() => navigation.goBack()}>
                Back
              </Button>
              <HStack mt="6" justifyContent="center">
                <Text fontSize="sm" color="muted.700" fontWeight={400}>
                  I'm a new user.{' '}
                </Text>
                <Link
                  _text={{
                    color: 'indigo.500',
                    fontWeight: 'medium',
                    fontSize: 'sm',
                  }}
                  onPress= {() => navigation.navigate("Register")}>
                  Sign Up
                </Link>
              </HStack>
            </VStack>
          </Box>
    )
}
