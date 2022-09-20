import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  makeStyles,
} from "@material-ui/core";

import { Link } from "react-router-dom";

const theme = makeStyles((theme) => ({
  navlinks: {
    marginLeft: theme.spacing(10),
    display: "inline",
  },
  logo: {
    cursor: "default",
	color: "blue",
	fontFamily: [
      'Snell Roundhand',
      'cursive',
    ].join(','),
  },
  link: {
    textDecoration: "none",
    color: "red",
	fontFamily: [
      'OCR A Std', 
	  'monospace',
    ].join(','),
    fontSize: "25px",
    marginLeft: theme.spacing(20),
  },
  style: {
	  background : '#F3CC64',
  },
}));

function Navbar() {
  const classes = theme();
  return (
    <AppBar position="static" className={classes.style}>
	<Typography variant="h5" className={classes.logo}>
		Celebrate WDW's 50th Anniversary!
    </Typography>
      <Toolbar>
	  {<img src="https://cdn1.parksmedia.wdprapps.disney.com/resize/mwImage/1/1600/900/90/media/disneyparks_v0100/1/media/mediaplayer/homepage/mickey-minnie-16x9.jpg" 
		height="110cm" width="200cm"/>}
          <div className={classes.navlinks}>
            <Link to="/" className={classes.link}>
              Home
            </Link>
            <Link to="/toystory" className={classes.link}>
              Toy Story
            </Link>
            <Link to="/codejokes" className={classes.link}>
              Coding
            </Link>
          </div>
      </Toolbar>
    </AppBar>
  );
}
export default Navbar;
