import React, {useState, useEffect} from 'react';
import axios from 'axios';
/* styles */
import styles from '../styles/ScrollView.module.css';
/* components */
import { Spot } from './Spot';
import SpotView from './SpotView';
import Map from './Map';
/* material ui */
import { Button } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons//Refresh';
/* config */
import { config } from '../config/Config';
/* React Loading */
import ReactLoading from 'react-loading';

const ScrollView: React.FC = () => {
  /* useState */
  const [spotData, setSpotData] = useState<Spot[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });

  /* Geolocation API に関する処理 */
  const getCurrentPosition = () => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      setPosition({ latitude, longitude });
    })
  };



  /* useEffect */
  useEffect( () => {
    /* mountフラグ */
    let isMounted: boolean = true;
    if(isMounted){
      /* 位置情報が取得できるか判定する */
      if( navigator.geolocation ){
        // 現在位置を取得できる場合の処理
        /* 位置情報をセットする */
        getCurrentPosition();
        } else {
        // 現在位置を取得できない場合の処理
        window.confirm("位置情報が取得できません");
        return;
        }
      
      setLoading(true);
      let spotJson: Spot[] = [];
      const url: string = config.allSpotGETUrl;
      axios.get(url, {
        params:{
          lng: position.longitude,
          lat: position.latitude
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
      setLoading(false);
    }
    /* unmountする */
    return () => { isMounted = false };
  },[]);

  /* 更新ボタンの処理 */
  const onUpdate = () => {
    /* 位置情報が取得できるか判定する */
    if( navigator.geolocation ){
      // 現在位置を取得できる場合の処理
      /* 位置情報をセットする */
      getCurrentPosition();
      } else {
      // 現在位置を取得できない場合の処理
      window.confirm("位置情報が取得できません");
      return;
      }

    setLoading(true);;
    let spotJson: Spot[] = [];
    const url: string = config.allSpotGETUrl;
    axios.get(url,{
      params:{
        lng: position.longitude,
        lat: position.latitude
        }
      })
         .then(res => {
           console.log("success");
           console.log(res);
           spotJson = res.data;
           console.log(spotJson);
           setSpotData(spotJson);
         })
         .catch(err => {
           console.log("failed");
           console.log(err);
         });
    setLoading(false);
    }
    
  return (
    <div>
      { !loading &&(
        <div className={styles.scrollView}>
          {spotData.map((spot, index) => 
            <SpotView spotData = {spot} key={index} />
          )}
        </div>
      )}
      { loading &&(
        <div className={styles.loadingArea}>
          <ReactLoading type="spin" color="#2adf88" className={styles.loadingIcon}></ReactLoading>
        </div>
      )}


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