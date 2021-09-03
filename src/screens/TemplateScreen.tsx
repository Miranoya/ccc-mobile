import React, {useState} from "react";

/* material-ui */
import { AppBar, Paper, Tabs, Tab, IconButton, Toolbar, Typography } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';

/* router */
import { Link } from "react-router-dom";

/* screens */
import HomeScreen from './HomeScreen';
import PostScreen from './PostScreen';

/* material icon */
import HomeIcon from '@material-ui/icons/Home';
import EmailIcon from '@material-ui/icons/Email';
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles({
  root: {
    fiex: 1,
    backgroundColor: "#E0E0E0",
  },
  appbar: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  menuButton: {

  },
  tabicon: {
    flex: 2,
  }
});


const Template: React.FC = () => {

  const classes = useStyles();
  const [value, setValue] = useState(0);

  const handleChange = (event: any, newValue: React.SetStateAction<number>) => {
    setValue(newValue);
  };

  return (
    <div>
      <div className={classes.appbar}>
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              タイトル
            </Typography>
          </Toolbar>
        </AppBar>
      </div>

      <div>
        <Paper square className={classes.root}>
          <Tabs value={value} onChange={handleChange} centered aria-label=" tabs">
            <Tab icon={<HomeIcon />} label="ホーム" component={Link} to="/"    className={classes.tabicon}/>
            <Tab icon={<EmailIcon />} label="報告"  component={Link} to="/post" className={classes.tabicon}/>
          </Tabs>
        </Paper>
      </div>
    </div>
  )
}

export default Template