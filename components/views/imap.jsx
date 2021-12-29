import React, { useState, useEffect } from "react";
import { WebView } from 'react-native-webview';


export default function imap(props) {

    let minlong = props.minLong
    let minlat = props.minLat

    let maxlong = props.maxLong
    let maxlat = props.maxLat

    const imap =
        '<iframe width="100%" height="100%" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://www.openstreetmap.org/export/embed.html?bbox='
        + minlong
        + '%2C'
        + minlat
        + '%2C'
        + maxlong
        + '%2C'
        + maxlat 
        + '&amp;layer=transportmap"></iframe>'

    return (
        <WebView
            source={{ html: imap }}
            style={{ flex: 1 }}
        />
    );
}
