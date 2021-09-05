import React, {useState} from 'react';
import axios from 'axios';
/* components */
import { Spot } from './Spot';
/* styles */
import styles from "../styles/SpotView.module.css";
/* material ui */
import { Box, IconButton } from '@material-ui/core';
import PanToolIcon from '@material-ui/icons/PanTool';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  agreeIconFalse: {
    width: 40,
    height: 40,
  },
  agreeIconTrue: {
    color: "red",
    width: 40,
    height: 40,
  }
});

interface Props{
  spotData: Spot;
}

const SpotView: React.FC<Props> = ({spotData}) => {
  const classes = useStyles();
  const [isAgreed, setIsAgreed] = useState(false);

  const onClickAgreed = () => {
    isAgreed ? (spotData.agreed--) : (spotData.agreed++);
    setIsAgreed(!isAgreed);
    const data = {agrred: isAgreed};
    const url: string="https://esrnf6poie.execute-api.us-east-1.amazonaws.com/Mock/spot/" + spotData.uuid;
    axios.patch(url, data)
         .then(res => {
           console.log("Sucusess");
           console.log(res.data);
         }).catch(err => {
           console.log("Failed");
           console.log(err.data);
         })
  };
  

  return (
    <div className={styles.view}>
      <Box border={1} borderRadius={16} className={styles.box}>

        <div className={styles.title}>
          {spotData.title}
        </div>

        <div className={styles.photoView}>
          <img src = {spotData.thumbnail} className={styles.previewImg} />
        </div>

        <div className={styles.agreeView}>
          <IconButton onClick={onClickAgreed} className={styles.agreeButton}>
            {isAgreed ? <PanToolIcon className={classes.agreeIconTrue}/> : <PanToolIcon className={classes.agreeIconFalse}/>}
          </IconButton>
          <div className={styles.agreeLabel}>
            {spotData.agreed}
          </div>
          <div>
            そう思う!
          </div>
        </div>
        
      </Box>
    </div>
  )
}

export default SpotView;