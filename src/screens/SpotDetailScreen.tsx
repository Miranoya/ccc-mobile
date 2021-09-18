import React from 'react';
import { useLocation, useHistory } from 'react-router';
/* components */
import { Spot } from '../components/Spot';
/* styles */
import styles from '../styles/SpotDetailScreen.module.css';
/* material ui */
import { Typography, Divider, Button } from "@material-ui/core";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const SpotDetailScreen: React.FC = () => {
  /* useLocation */
  const location = useLocation<any>();
  /* useHistory */
  const history = useHistory();
  /* locationで渡されるデータ */
  const recvData: any = location.state;
  /* データをSpot型にキャストする */
  const spotData: Spot = recvData.spotData;

  /* 戻るボタン */
  const onClickBackButton = () => {
    history.goBack();
  }

  return(
    <div className={styles.detailView}>

      <div className={styles.spotTitleBlock}>
        <Typography variant="h5" className={styles.spotTitle}>
          {spotData.title}
        </Typography>
      </div>

      <Divider variant="middle" className={styles.divider} />

      <div className={styles.imageView}>
        {/*
        {(spotData.thumbnail) && (
          <img
            src={spotData.thumbnail}
            alt=""
          />
        )}
        {(spotData.sub_image_1) && (
          <img
            src={spotData.sub_image_1}
            alt=""
          />
        )}
        {(spotData.sub_image_2) && (
          <img
            src={spotData.sub_image_2}
            alt=""
          />
        )} */}
        <img 
          src="https://images-fe.ssl-images-amazon.com/images/I/91aUXrZD9ML._CR480,0,837,1488_SY1334__SX375_.jpg" 
          alt=""
          className={styles.previewImg}
        />
        <img 
          src="https://join.biglobe.ne.jp/mobile/sim/gurashi/wp-content/uploads/2017/02/smp_picture-612x336.jpg" 
          alt=""
          className={styles.previewImg}
        />
        <img 
          src="https://images-fe.ssl-images-amazon.com/images/I/91aUXrZD9ML._CR480,0,837,1488_SY1334__SX375_.jpg" 
          alt=""
          className={styles.previewImg}
        />
      </div>

      <Divider variant="middle" className={styles.divider} />

      <div className={styles.detailArea}>
        {spotData.detail}
      </div>

      <Divider variant="middle" className={styles.divider} />

      <div className={styles.spotInfo}>
        <div className={styles.info}>
          場所：{spotData.place}
        </div>
        <div className={styles.info}>
          現在状況：<span className={styles.status}>{spotData.status}</span>
        </div>
      </div>

      <div className={styles.buttonArea}>      
        <Button onClick={onClickBackButton} variant="contained" color="primary" className={styles.bottomButton} >
          <ArrowBackIcon className={styles.buttonIcon} fontSize="small" />
          <span>戻る</span>
        </Button>
      </div>

    </div>
  )
}

export default SpotDetailScreen;