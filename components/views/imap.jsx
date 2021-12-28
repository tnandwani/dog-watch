import React, { useState, useEffect } from "react";
import { WebView } from 'react-native-webview';


export default function imap() {

    const imap = '<iframe width="100%" height="80%" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://www.openstreetmap.org/export/embed.html?bbox=-101.45050048828126%2C33.779147331286474%2C-96.86370849609376%2C35.84008157153468&amp;layer=mapnik"></iframe>'

    return (

        <WebView
            originWhitelist={['*']}
            source={{ html: imap }}
        />



    );
}
