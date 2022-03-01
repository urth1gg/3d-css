import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

const useStyles = makeStyles((theme) => ({
  root: {
  	width:'250px',
    margin: '0 auto'
  },
  margin: {
    height: theme.spacing(3),
  },
}));


function valuetext(value) {
  return `${value} ft`;
}


function LongtitudeSlider({defaultValue, onChange, min, max, marks}) {
  const classes = useStyles();

  let [val, setVal] = useState(defaultValue)

  function _onChange(e,value){
    if(val === value) return;
    setVal(value)
    onChange(value, 'length')
  }

  return (
    <div className={classes.root}>
      <Typography id="discrete-slider-custom" gutterBottom>
        Length
      </Typography>
      <Slider
        value={val}
        getAriaValueText={valuetext}
        aria-labelledby="discrete-slider-custom"
        step={1}
        max={max || 130}
        min={min || 110}
        valueLabelDisplay="auto"
        marks={marks}
        onChange={_onChange}
      />
    </div>
  );
}

function WidthSlider({defaultValue, onChange, min, max, marks}){
  const classes = useStyles();

  let [val, setVal] = useState(defaultValue)

  function _onChange(e,value){
    if(val === value) return;
    setVal(value)
    onChange(value, 'width')
  }

  return (
    <div className={classes.root}>
      <Typography id="discrete-slider-custom" gutterBottom>
        Width
      </Typography>
      <Slider
        value={val}
        getAriaValueText={valuetext}
        aria-labelledby="discrete-slider-custom"
        step={1}
        min={min || 50}
        max={max || 70}
        valueLabelDisplay="auto"
        onChange={_onChange}
        marks={marks}
      />
    </div>
  );
}

export {WidthSlider, LongtitudeSlider}