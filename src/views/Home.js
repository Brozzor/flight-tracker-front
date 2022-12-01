import React from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, useMap, Popup, Marker, useMapEvent } from 'react-leaflet'

const Home = () => {


  return (
    <div>
        <MapContainer className="h-64 w-64" center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[51.505, -0.09]}>
                <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
        </MapContainer>
    </div>
    
    );
};

export default Home;