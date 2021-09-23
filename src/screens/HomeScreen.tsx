import React, { useState } from "react";
/* components */
import ScrollView from "../components/ScrollView";
/* styles */
import styles from '../styles/HomeScreen.module.css';
/* material ui */
import { Typography, Divider } from "@material-ui/core";
/* switch selector */
import SwitchSelector from "react-switch-selector";

const HomeScreen: React.FC = () => {

  /* state */
  const [isAll, setIsAll] = useState<boolean>(false);
  const [typography, setTypography] = useState<string>("近くの危険箇所");

  /* selector option */
  const options = [
    {
      label: <span className={styles.selectorLabel}>近く</span>,
      value: false,
      selectedBackgroundColor: "#2adf88",
    },
    {
      label: <span className={styles.selectorLabel}>すべて</span>,
      value: true,
      selectedBackgroundColor: "#51fff5"
    }
  ];

  /* handler */
  const onChange = (isCheck: any) => {
    console.log(isCheck);
    setIsAll(isCheck);
    if(isCheck) {
      setTypography("報告一覧");
    } else {
      setTypography("近くの危険箇所");
    }
  }

  return (
    <div>
      <div className={styles.spotViewInfo}>
        <Typography variant="h5" className={styles.spotViewTitle}>
          {typography}
        </Typography>

        <div className={styles.switchSelectorWrapper}>
          <SwitchSelector
                onChange={onChange}
                options={options}
                backgroundColor={"#353b48"}
                fontColor={"#f5f6fa"}
          />
        </div>

      </div>
      <Divider variant="middle" className={styles.divider} />
      {isAll && (
        <ScrollView isAll={true} />
      )}
      {!isAll && (
        <ScrollView isAll={false} />
      )}
      <Divider variant="middle" className={styles.divider} />
    </div>
  )
}

export default HomeScreen;