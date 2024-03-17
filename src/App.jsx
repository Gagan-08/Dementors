import { useEffect, useState } from 'react'
import axios from 'axios'
import MessageBox from './components/Messagebox'
import bulbOn from "./assets/bulbOn.png"
import bulbOff from "./assets/bulbOff.png"
import { IoBulbSharp } from "react-icons/io5";
import { SketchPicker } from 'react-color';
import fanOn from "./assets/fanOn.gif"
import fanOff from "./assets/fanOff.jpg"
import { Slider, Switch } from '@mui/material'
import acOff from "./assets/acOff.jpg"
import acOn from "./assets/acOn.gif"
import "./App.css"
import { FaMinus, FaPlus } from "react-icons/fa6";
let teamid = "ksl9YPV"

function App() {
  const [bulb, setbulb] = useState(0)
  const [fan, setfan] = useState(0)
  const [led, setled] = useState("#fff")
  const [showledColorPicker, setshowledColorPicker] = useState(false)
  const [acstate, setacstate] = useState(0)
  const [actemp, setactemp] = useState(23)
  const [showMessage, setShowMessage] = useState(false)
  // useEffect(() => {
  //   (async () => {
  //     try {
  //       setShowMessage({ loading: true, message: "Loading.." })
  //       let res = await axios.get(`https://kodessphere-api.vercel.app/devices/${teamid}`)
  //       setShowMessage(false)
  //       setbulb(res.data.bulb)
  //       setfan(res.data.fan)
  //       setled(res.data.led)
  //       setacstate(res.data.ac.state)
  //       setactemp(res.data.ac.temp)
  //     } catch (error) {
  //       setShowMessage({ error: true, message: "Unable to fetch data!", dismissable: true })
  //     }
  //   })()
  // }, [])
  async function handleBulb() {
    try {
      let res;
      const rawData = JSON.stringify({
        teamid: teamid,
        device: "bulb",
        value: bulb == 0 ? 1 : 0
      });
      res = await axios.post(`https://kodessphere-api.vercel.app/devices`, rawData, { headers: { 'Content-Type': 'application/json' } })
      if (!res.data.success)
        throw new Error("")
      if (bulb == 0)
        setbulb(1)
      else
        setbulb(0)
    } catch (error) {
      setShowMessage({ error: true, message: "Unable to update state!", dismissable: true })
    }
  }
  async function handleLed(color) {
    try {
      const rawData = JSON.stringify({ teamid, device: "led", value: color.hex });
      let res = await axios.post(`https://kodessphere-api.vercel.app/devices`, rawData, { headers: { 'Content-Type': 'application/json' } })
      if (!res.data.success)
        throw new Error("")
      setled(color.hex)
      setshowledColorPicker(false)
    } catch (error) {
      setShowMessage({ error: true, message: "Unable to update state!", dismissable: true })
    }
  }
  async function handleFan(evt) {
    try {
      const rawData = JSON.stringify({ teamid, device: "fan", value: evt.target.value });
      let res = await axios.post(`https://kodessphere-api.vercel.app/devices`, rawData, { headers: { 'Content-Type': 'application/json' } })
      if (!res.data.success)
        throw new Error("")
      setfan(evt.target.value)
    } catch (error) {
      setShowMessage({ error: true, message: "Unable to update state!", dismissable: true })
    }
  }
  async function handleAcState(evt) {
    try {
      const rawData = JSON.stringify({ teamid, device: "ac", value: { "temp": actemp, "state": evt.target.checked ? 1 : 0 } });
      let res = await axios.post(`https://kodessphere-api.vercel.app/devices`, rawData, { headers: { 'Content-Type': 'application/json' } })
      if (!res.data.success)
        throw new Error("")
      setacstate(evt.target.checked ? 1 : 0)
      window.location.reload()
    } catch (error) {
      setShowMessage({ error: true, message: "Unable to update state!", dismissable: true })
    }
  }
  async function increaseTemp(){
    try {
      if(actemp==29){
        setShowMessage({error:true,message:"Temperature cannot be greater than 29",dismissable:true})
        return;
      }
      const rawData = JSON.stringify({ teamid, device: "ac", value: { "temp": actemp+1, "state": acstate } });
      let res = await axios.post(`https://kodessphere-api.vercel.app/devices`, rawData, { headers: { 'Content-Type': 'application/json' } })
      if (!res.data.success)
        throw new Error("")
      setactemp(actemp+1)
    } catch (error) {
      setShowMessage({ error: true, message: "Unable to update state!", dismissable: true })
    }
  }
  async function decreaseTemp(){
    try {
      if(actemp==17){
        setShowMessage({error:true,message:"Temperature cannot be less than 17",dismissable:true})
        return;
      }
      const rawData = JSON.stringify({ teamid, device: "ac", value: { "temp": actemp-1, "state": acstate } });
      let res = await axios.post(`https://kodessphere-api.vercel.app/devices`, rawData, { headers: { 'Content-Type': 'application/json' } })
      if (!res.data.success)
        throw new Error("")
      setactemp(actemp-1)
    } catch (error) {
      setShowMessage({ error: true, message: "Unable to update state!", dismissable: true })
    }
  }
  return (
    <>
      {showMessage && <MessageBox message={showMessage.message} error={showMessage.error} success={showMessage.success} loading={showMessage.loading} dismissable={showMessage.dismissable} setShowMessage={setShowMessage} />}
      <h1 style={{ textAlign: 'center' }}>Team Dementors</h1>
      <h3 style={{ textAlign: 'center' }}>Manage Your Smart Devices with Ease</h3>
      <div className="control-panel">
        <div className="control-card">
          <h3>Bulb</h3> <img style={{cursor:"pointer"}} role="button" src={bulb == 0 ? bulbOff : bulbOn} onClick={handleBulb} />
          State: {bulb==0?"Off":"On"}
        </div>
        <div className="control-card">
          <h3>LED</h3>
          <IoBulbSharp onClick={() => { setshowledColorPicker(!showledColorPicker) }} style={{ color: led == "#fff" ? "" : led ,cursor:"pointer"}} />
          Color: {led}
          {showledColorPicker && <SketchPicker color={led} onChange={handleLed} />}
        </div>
        <div className="control-card">
          <h3>AC</h3> 
          {acstate === 0 && <img src={acOff} />}
          {acstate === 1 && <img src={acOn} />}
          <Switch checked={acstate === 1} onChange={handleAcState} inputProps={{ 'aria-label': 'controlled' }} />
          <div style={{ display: "flex", alignItems: "center" }}>
            <FaPlus onClick={increaseTemp} style={{ width: "40%", marginRight: "5px",cursor:"pointer" }} />
            <span style={{ width: "20%", textAlign: "center", marginRight: "5px" }}>{actemp}</span>
            <FaMinus onClick={decreaseTemp} style={{ width: "40%", marginLeft: "5px",cursor:"pointer" }} />
          </div>
        </div>
        <div className="control-card">
          <h3>Fan</h3> <img src={fan == 0 ? fanOff : fanOn} />
          <Slider value={fan} step={1} max={5} valueLabelDisplay="auto" onChange={handleFan} marks={true} style={{ width: '80%' }} />
        </div>
      </div>
    </>
  )
}

export default App
