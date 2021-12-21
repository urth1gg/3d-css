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

const marks = [
  {
    value: 110,
    label: '110 ft',
  },
  {
    value: 130,
    label: '130 ft',
  }
];

function valuetext(value) {
  return `${value} ft`;
}


function LongtitudeSlider({defaultValue, onChange}) {
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
        max={130}
        min={110}
        valueLabelDisplay="auto"
        marks={marks}
        onChange={_onChange}
      />
    </div>
  );
}

const marks2 = [
  {
    value: 50,
    label: '50 ft',
  },
  {
    value: 70,
    label: '70 ft',
  }
];

function WidthSlider({defaultValue, onChange}){
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
        min={50}
        max={70}
        valueLabelDisplay="auto"
        onChange={_onChange}
        marks={marks2}
      />
    </div>
  );
}

export {WidthSlider, LongtitudeSlider}