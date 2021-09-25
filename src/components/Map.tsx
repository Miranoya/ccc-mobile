import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
/* styles */
import styles from '../styles/Map.module.css';
/* components */
import { Spot } from './Spot';

interface Props {
  spotDatas: Spot[];
  lat: number;
  lng: number;
}

interface Position {
  lat: number;
  lng: number;
}

const Map: React.FC<Props> = ({spotDatas, lat, lng}) => {
  /* state */
  const [spots, setSpots] = useState<Spot[]>([]);
  const [selfPosition, setSelfPosition] = useState<Position>({lat: 0, lng: 0})
  /* position array */
  let positions: Position[] = [];
  /* api key */
  const API_KEY: string = String(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
  /* map style*/
  const containerStyle = {
    width: "80vw",
    height: "100%"
  };
  /* center */
  const center = {
    lat: lat,
    lng: lng,
  };
  /* option */
  const options = {
    disableDefaultUI: true,
    zoomControl: true,
  };
  /* useEffect */
  useEffect(() => {
    setSpots(spotDatas);
    setSelfPosition({lat: lng, lng: lng});
    spotDatas.map((spot) => {
      positions.push({lat: spot.lat, lng: spot.lng});
    });
    console.log(spotDatas);
    console.log({lat: lat, lng: lng});
  },[]);

  return(
    <div className={styles.rectWrap}>
      <div className={styles.rect}>

        {(lng!==0 && lat!==0) &&
          <LoadScript googleMapsApiKey={API_KEY}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              options={options}
              zoom={15}
            >
            <Marker position={center} />
            { positions.map((position, index) => {
                <Marker position={position} label={"危険箇所"} key={index} />
                console.log(position);
              })
            }
            </GoogleMap>
          </LoadScript>
        }
        {(lng===0 && lat===0) &&
          <div>地図が表示できません</div>
        } 

      </div>
    </div>
  );
};

export default Map;