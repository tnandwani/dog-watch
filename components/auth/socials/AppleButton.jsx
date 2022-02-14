import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { ResponseType } from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import { OAuthProvider } from "firebase/auth";

import * as AppleAuthentication from 'expo-apple-authentication';
import { socialSignIn } from '../../../database';

WebBrowser.maybeCompleteAuthSession();

export default function AppleButton() {

    return (
        <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={5}
            style={{ width: 200, height: 44 }}
            onPress={async () => {
                try {
                    const credential = await AppleAuthentication.signInAsync({
                        requestedScopes: [
                            AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                            AppleAuthentication.AppleAuthenticationScope.EMAIL,
                        ],
                    });
                    console.log("cred is" );
                    console.log(credential);
                    // signed in

                    const provider = new OAuthProvider('apple.com');
                    const authCredential = provider.credential({
                        idToken: credential.identityToken
                    });
                    socialSignIn(authCredential);
                


                } catch (e) {
                    if (e.code === 'ERR_CANCELED') {
                        // handle that the user canceled the sign-in flow
                    } else {
                        // handle other errors
                    }
                }
            }}
        />
    );
}
