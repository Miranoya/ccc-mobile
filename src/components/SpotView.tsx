import React from 'react';
/* styles */
import styles from "../styles/SpotView.module.css";
/* material ui */
import { Box, IconButton } from '@material-ui/core';
import PanToolIcon from '@material-ui/icons/PanTool';

const SpotView: React.FC = () => {
  return (
    <div className={styles.view}>
      <Box border={1} className={styles.box}>
        <div className={styles.title}>
          タイトル
        </div>
        <div className={styles.photoView}>
          photo
        </div>
        <div>
          <IconButton>
            <PanToolIcon />
          </IconButton>
        </div>
      </Box>
    </div>
  )
}

export default SpotView;