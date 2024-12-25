

import React, { useState, useRef, useEffect } from 'react';

const Metronome = () => {
  const [state, setState] = useState({
    active: false,
    bpm: 140,
    perMeasure: 4,
    currentBeat: 0,
    calculating: false,
    times: [],
    measure: "",
  });

  const click1 = useRef(new Audio("/audio/click_1.wav"));
  const click2 = useRef(new Audio("/audio/click_2.wav"));
  const intervalRef = useRef(null);

  const playClick = () => {
    const { perMeasure, currentBeat, measure } = state;
    let temp = "";

    if (currentBeat % perMeasure === 0) {
      const newClick1 = new Audio("/audio/click_1.wav");
      newClick1.play();
      
      if (currentBeat % (perMeasure * 2) === 0) {
        temp = "★ ";
      } else {
        temp = measure + "★ ";
      }
    } else {
      const newClick2 = new Audio("/audio/click_2.wav");
      newClick2.play();
      
      if (perMeasure === 0 && measure.length > 18) {
        temp = "☆ ";
      } else {
        temp = measure + "☆ ";
      }
    }

    setState(prev => ({
      ...prev,
      measure: temp,
      currentBeat: prev.currentBeat + 1,
    }));
  };

  const resetPlay = () => {
    if (state.active) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(playClick, ((60/state.bpm) * 1000));
    }
  };

  const changeBpm = (event) => {
    const bpm = event.target.value;
    setState(prev => ({
      ...prev,
      bpm,
      currentBeat: 0,
    }));
    resetPlay();
  };

  const selectChange = (event) => {
    setState(prev => ({
      ...prev,
      perMeasure: event.target.value,
    }));
    resetPlay();
  };

  const playPause = () => {
    if (state.active) {
      clearInterval(intervalRef.current);
      setState(prev => ({
        ...prev,
        active: false,
        currentBeat: 0,
        measure: "",
      }));
    } else {
      setState(prev => ({
        ...prev,
        active: true,
        currentBeat: 0,
        measure: "",
      }));
      intervalRef.current = setInterval(playClick, ((60/state.bpm) * 1000));
    }
  };

  const calculateBPM = (times) => {
    if (times.length > 1) {
      let sumOfGaps = 0;
      for (let i = 1; i < times.length; i++) {
        sumOfGaps += (times[i] - times[i-1]);
      }
      let average = sumOfGaps/(times.length-1);
      let bpm = Math.round((1000/average) * 60);
      bpm = Math.min(Math.max(bpm, 35), 250);
      setState(prev => ({ ...prev, bpm }));
    }
  };

  const checkTimeout = (time, lastTime) => {
    if (time === lastTime) {
      setState(prev => ({
        ...prev,
        calculating: false,
        times: [],
        ...(!prev.active && { currentBeat: 0, measure: "" }),
      }));
    }
  };

  const setBpm = () => {
    playClick();
    const time = new Date().getTime();
    
    setState(prev => {
      const newTimes = [...prev.times, time].slice((prev.perMeasure * 2) * -1);
      return {
        ...prev,
        calculating: true,
        times: newTimes,
      };
    });

    calculateBPM(state.times);
    setTimeout(() => checkTimeout(time, state.times[state.times.length - 1]), 2000);
  };

  const plusMinus = (x) => {
    const newBpm = Math.min(Math.max(parseInt(state.bpm) + x, 35), 250);
    setState(prev => ({
      ...prev,
      bpm: newBpm,
    }));
    resetPlay();
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const { active, bpm, perMeasure, calculating, measure } = state;

  return (
    <div className="metronome">
      <div className="bpm">
        <div>
          <span className={calculating ? "activeBPM" : null}>{bpm}</span> BPM
        </div>
        <div className="sliderContainer">
          <button 
            className="plusMinus" 
            onClick={() => plusMinus(-1)}
          >
            <img src="/minus.svg" alt="decrease tempo" />
          </button>
          <input 
            type="range" 
            min="35" 
            max="250" 
            className="slider" 
            value={bpm} 
            onChange={changeBpm}
          />
          <button 
            className="plusMinus" 
            onClick={() => plusMinus(1)}
          >
            <img src="/plus.svg" alt="increase tempo" />
          </button>
        </div>
      </div>
      <div className="buttons">
        <button 
          className="circleButton" 
          onClick={playPause}
        >
          <img src={active ? "/pause.svg" : "/play.svg"} alt={active ? "pause" : "play"} />
        </button>
        <button 
          className="circleButton" 
          disabled={active} 
          onClick={setBpm}
        >
          <img src={active ? "/recordDisabled.svg" : "/record.svg"} alt="set BPM" />
        </button>
      </div>
      <div className="timeSignature">
        Beats per measure: &nbsp;
        <select 
          className="selectStyle" 
          onChange={selectChange} 
          value={perMeasure}
        >
          {[0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
            <option key={num} value={num}>
              {num === 0 ? 'N/A' : num}
            </option>
          ))}
        </select>
      </div>
      <span className="measure">{measure}</span>
    </div>
  );
};

export default Metronome;