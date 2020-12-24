import React from 'react';
import { MapContainer , TileLayer, useMap} from "react-leaflet";
import './CovidMap.css';
import {showDataOnMap} from './utils';

function ChangeView({ center, zoom, countries,casesType}) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
}


function CovidMap({countries,casesType,center,zoom}) {
    return (
        <div className="map">
            <MapContainer>
                <TileLayer 
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />  
                 <ChangeView center={center} zoom={zoom} countries={countries} casesType={casesType}/> 
                {showDataOnMap(countries,casesType)};
            </MapContainer>
          
        </div>
    );
}

export default CovidMap;
