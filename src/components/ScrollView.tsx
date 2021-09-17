import React, {useState, useEffect} from 'react';
import axios from 'axios';
/* styles */
import styles from '../styles/ScrollView.module.css';
/* components */
import { Spot } from './Spot';
import SpotView from './SpotView';
/* material ui */
import { Button } from '@material-ui/core';
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
  },[])

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

  const spotDatas: Spot[] = [
    {
      uuid: "aaa",
      title: "危険箇所1",
      detail: "hogehoge1",
      lng: 0,
      lat: 0,
      place: "福島",
      thumbnail: "https://dol.ismcdn.jp/mwimgs/c/8/1080m/img_c8dad835c4b9134b067cc8b8efcab22f143142.jpg",
      sub_image_1: "https://dol.ismcdn.jp/mwimgs/c/8/1080m/img_c8dad835c4b9134b067cc8b8efcab22f143142.jpg",
      sub_image_2: "https://dol.ismcdn.jp/mwimgs/c/8/1080m/img_c8dad835c4b9134b067cc8b8efcab22f143142.jpg",
      sub_image_3: "https://dol.ismcdn.jp/mwimgs/c/8/1080m/img_c8dad835c4b9134b067cc8b8efcab22f143142.jpg",
      agreed: 20,
      status: "保留中"
    }
  ]

  return (
    <div>
      { !loading &&(
        <div className={styles.scrollView}>
          {spotData.map((spot) => 
            <SpotView spotData = {spot} />
          )}
        </div>
      )}
      { loading &&(
        <div className={styles.loadingArea}>
          <ReactLoading type="spin" color="#2adf88" className={styles.loadingIcon}></ReactLoading>
        </div>
      )}
      <Button onClick={onUpdate}>更新</Button>
    </div>
  )
}

export default ScrollView;