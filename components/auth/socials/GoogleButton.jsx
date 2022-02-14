import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { ResponseType } from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import { getAuth, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { Button } from "native-base"
import { AntDesign } from '@expo/vector-icons';
import webClient from '../clients/tokens.json'
import { googleSignIn, socialSignIn } from '../../../database';


WebBrowser.maybeCompleteAuthSession();

export default function GoogleButton() {

    const [request, response, promptAsync] = Google.useIdTokenAuthRequest(
        {
            clientId: webClient.web.client_id,
            iosClientId: webClient.ios.CLIENT_ID
        },
    );

    React.useEffect(() => {
        if (response?.type === 'success') {
            const { id_token} = response.params
            const credential = GoogleAuthProvider.credential(id_token)

            socialSignIn(credential);
        }
    }, [response]);

    return (
        <Button
            colorScheme="red"
            leftIcon={<AntDesign name="google" size={24} color="white" />}
            onPress={() => promptAsync()}
        >
            Google Login
        </Button>

    );
}
