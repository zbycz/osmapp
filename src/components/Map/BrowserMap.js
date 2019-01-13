import * as React from "react";
import L from "leaflet";

class BrowserMap extends React.Component {
    constructor() {
        super();
        this.mapRef = React.createRef();
        this.map = null;
    }

    componentDidMount() {
        this.map = L.map(this.mapRef.current, {
            center: [50.0, 15.0],
            zoom: 8
        });

        const baseLayer = L.tileLayer(
            "http://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        );
        baseLayer.addTo(this.map);
    }

    componentWillUnmount() {
        if (this.map) this.map.remove();
    }

    render() {
        return (
            <>
                <div ref={this.mapRef} style={{ height: '100%', width: '100%' }}/>
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.4.0/dist/leaflet.css"/>
            </>
        );
    }
}


export default BrowserMap;
