import React from "react";
import { WebView } from 'react-native-webview';
import { googleAPI } from "../../constants";


export default function Gmap(props) {

    let lat = props.lat
    let long = props.long

    let embed;

    if (lat && long) {
        embed =
            '<iframe width="100%" height="100%" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://www.google.com/maps/embed/v1/view?key='
            + googleAPI
            + '&center='
            + lat
            + ','
            + long
            + '&zoom=14"></iframe>'
    }
    else {
        // no location - show USA
        embed =
            '<iframe width="100%" height="100%" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://www.google.com/maps/embed/v1/view?key='
            + googleAPI
            + '&center=39.5538121,-98.0792827&zoom=4"></iframe>'
    }



    return (
        <WebView
            source={{ html: embed }}
            style={{ flex: 1 }}
        />
    );
}
