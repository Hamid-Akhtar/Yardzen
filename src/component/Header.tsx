import React from "react";
import { makeStyles } from "@material-ui/core";
import {Toolbar, AppBar , Typography }from "@material-ui/core";

const useStyles = makeStyles((theme:any) => ({
  root: {
    flexGrow: 1,position:"sticky",top:"0"
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function Header() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar
        position="static"
        style={{ backgroundColor: "white", color: "black" }}
      >
        <Toolbar>
          <img src="//images.squarespace-cdn.com/content/v1/5aa96d162487fd55c7f9891f/1597943383050-FF5YAFWDJE577FRO537W/LogoNew.png?format=1500w" alt="logo" width="200px"/>
          <Typography variant="h6" className={classes.title}>
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}