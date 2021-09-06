import React, {useState, useEffect} from 'react';
import axios from 'axios';
/* styles */
import styles from '../styles/ScrollView.module.css';
/* components */
import { Spot } from './Spot';
import SpotView from './SpotView';
/* material ui */
import { Button } from '@material-ui/core';

const ScrollView: React.FC = () => {
  const [spotData, setSpotData] = useState<Spot[]>([]);

  /* useEffect */
  useEffect( () => {
    let spotJson: Spot[] = [];
    const url: string = "https://esrnf6poie.execute-api.us-east-1.amazonaws.com/Mock/spot";
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
  })

  /* 更新ボタンの処理 */
  const onUpdate = () => {
    let spotJson: Spot[] = [];
    const url: string = "https://esrnf6poie.execute-api.us-east-1.amazonaws.com/Mock/spot";
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
      <div className={styles.scrollView}>
        {spotData.map((spot) => 
          <SpotView spotData = {spot} />
        )}
      </div>
      <Button onClick={onUpdate}>更新</Button>
    </div>
  )
}

export default ScrollView;