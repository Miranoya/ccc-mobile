import React, { useState } from "react";
import symbolicateStackTrace from "react-native/Libraries/Core/Devtools/symbolicateStackTrace";
/* components */
import SpotView from '../components/SpotView';
/* styles */
import styles from '../styles/HomeScreen.module.css';

const HomeScreen: React.FC = () => {

  return (
    <div className={styles.scrollView}>
      <SpotView />
      <SpotView />
    </div>
  )
}

export default HomeScreen