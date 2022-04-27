import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider } from 'firebase/auth';
import { Button } from "native-base"
import { AntDesign } from '@expo/vector-icons';
import webClient from '../clients/tokens.json'
import { socialSignIn } from '../../../database';
import { makeRedirectUri } from 'expo-auth-session';


WebBrowser.maybeCompleteAuthSession();

export default function GoogleButton() {

    const safeRedirect = AuthSession.makeRedirectUri({ useProxy: true });
    
    const [request, response, promptAsync] = Google.useAuthRequest(
        {
            clientId: webClient.web.client_id,
            iosClientId: webClient.ios.CLIENT_ID,
            androidClientId: webClient.android.CLIENT_ID
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
            colorScheme="orange"
            leftIcon={<AntDesign name="google" size={24} color="white" />}
            onPress={() => promptAsync({ safeRedirect}) }
        >
            Google Login
        </Button>

    );
}
