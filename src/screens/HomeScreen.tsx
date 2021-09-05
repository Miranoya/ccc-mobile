import React, { useState } from "react";
/* components */
import ScrollView from "../components/ScrollView";
/* styles */
import styles from '../styles/HomeScreen.module.css';
/* material ui */
import { Typography, Divider } from "@material-ui/core";

const HomeScreen: React.FC = () => {

  return (
    <div>
      <div className={styles.spotViewInfo}>
        <Typography variant="h5" className={styles.spotViewTitle}>
          近くの危険箇所
        </Typography>
      </div>
      <ScrollView />
      <Divider variant="middle" className={styles.divider} />
    </div>
  )
}

export default HomeScreen;