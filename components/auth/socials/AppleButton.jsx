import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { ResponseType } from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import { OAuthProvider } from "firebase/auth";
import sha256 from 'js-sha256';

import * as AppleAuthentication from 'expo-apple-authentication';
import { sendFireError, socialSignIn } from '../../../database';

WebBrowser.maybeCompleteAuthSession();

export default function AppleButton() {

    const unhashedNonce = "da homies"
    const hashedNonce = sha256("da homies")

    return (
        <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={5}
            style={{ width: 200, height: 44 }}
            onPress={async () => {
                AppleAuthentication.signInAsync({
                    requestedScopes: [
                        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                        AppleAuthentication.AppleAuthenticationScope.EMAIL,
                    ],
                    nonce: hashedNonce,
                }).then((credential) => {
                    console.log("cred is");
                    console.log(credential);
                    // signed in

                    const provider = new OAuthProvider('apple.com');
                    const authCredential = provider.credential({
                        idToken: credential.identityToken,
                        rawNonce: unhashedNonce,
                    });
                    socialSignIn(authCredential);
                }).catch((err) => {

                    sendFireError(err, 'Apple.login.credentials')
                    alert(err)
                });;

            }}
        />
    );
}
