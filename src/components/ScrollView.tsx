import React, {useState, useEffect, Component} from 'react';
import axios from 'axios';
/* styles */
import styles from '../styles/ScrollView.module.css';
/* components */
import { Spot } from './Spot';
import SpotView from './SpotView';
import Map from './Map';
/* material ui */
import { Button, Divider } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons//Refresh';
/* config */
import { config } from '../config/Config';
/* React Loading */
import ReactLoading from 'react-loading';
/* slick */
import Slider from "react-slick"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { mock } from '../mock/mock';

interface Props{
 isAll: boolean;
}

const ScrollView: React.FC<Props> = ({isAll}) => {
  /* useState */
  const [spotData, setSpotData] = useState<Spot[]>(mock);
  const [loading, setLoading] = useState<boolean>(false);
  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });
  const [isAvailable, setAvailable] = useState<boolean>(false);

  /* variables */
  let isLocationAvailable: boolean = isAvailable;
  let lat: number = 0;
  let lng: number = 0;

  /* arrow option */
  const Arrow = (props: any) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, background: "#a9a9a9"}}
        onClick={onClick}
      />
    );
  }

  /* slick option */
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <Arrow />,
    prevArrow: <Arrow />,
  };

  /* Geolocation API に関する処理 */
  const getCurrentPosition = () => {
    return new Promise<void>(resolve => {
      navigator.geolocation.getCurrentPosition(resPosition => {
        const { latitude, longitude } = resPosition.coords;
        lat = latitude;
        lng = longitude;
        setPosition({latitude, longitude});
        console.log(resPosition);
        resolve();
      });
    });
  };

  /* アップデート処理 */
  const update = async() => {
    if(isLocationAvailable) {
      /* 位置情報を取得する */
      await getCurrentPosition()
      console.log({lat: lat, lng: lng});
      /* 位置情報が取得できていたら */
      setLoading(true);
      let spotJson: Spot[] = [];
      const url: string = config.allSpotGETUrl;
      
      /* GET処理分岐 */
      if(isAll) {
        /* 全て */
        axios.get(url)
            .then(res => {
              console.log("success");
              spotJson = res.data; 
              console.log(spotJson);
              setSpotData(spotJson);
            })
            .catch(err => {
              console.log("failed");
              console.log(err);
            });
      } else {
        /* 近く */
        axios.get(url, {
          params:{
            lng: lng,
            lat: lat
            }
          })
            .then(res => {
              console.log("success");
              spotJson = res.data; 
              console.log(spotJson);
              setSpotData(spotJson);
            })
            .catch(err => {
              console.log("failed");
              console.log(err);
            });
      }
      
      setLoading(false);
      }
    }

  /* useEffect */
  useEffect( () => {
    /* mountフラグ */
    let isMounted: boolean = true;
    if(isMounted){
      if (navigator.geolocation) {
        isLocationAvailable = true;
        setAvailable(isLocationAvailable);
        // update();
      } else {
        window.confirm("位置情報サービスを利用できません");
      }
    }
    /* unmountする */
    return () => { isMounted = false };
  },[]);

  /* 更新ボタンの処理 */
  const onUpdate = () => {
    // update();
    console.log("update")
  }

    
  return (

    <div>
      { !loading &&(
        <div className={styles.scrollView}>
          <Slider {...settings} className={styles.slider}>
          {spotData.map((spot, index) => 
            <SpotView spotData = {spot} key={index} />
          )}
          </Slider>
        </div>
      )}
      { loading &&(
        <div className={styles.loadingArea}>
          <ReactLoading type="spin" color="#2adf88" className={styles.loadingIcon}></ReactLoading>
        </div>
      )}

      <Divider variant="middle" className={styles.divider} />

      <Map spotDatas={spotData} lat={position.latitude} lng={position.longitude} />
      
      <div className={styles.buttonArea}>      
        <Button onClick={onUpdate} variant="contained" color="primary" className={styles.bottomButton} >
          <RefreshIcon className={styles.buttonIcon} fontSize="small" />
          <span>更新</span>
        </Button>
      </div> 
    </div> 

  )
}

export default ScrollView;