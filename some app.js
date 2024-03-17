import { useEffect, useState } from 'react'
import axios from 'axios'
import MessageBox from './components/Messagebox'
import bulbOn from "./assets/bulbOn.png"
import bulbOff from "./assets/bulbOff.png"
import { IoBulbSharp } from "react-icons/io5";
import { SketchPicker } from 'react-color';
import fanOn from "./assets/fanOn.gif"
import fanOff from "./assets/fanOff.jpg"
import { Card, CardMedia, Slider, Switch } from '@mui/material'
import acOff from "./assets/acOff.jpg"
import acOn from "./assets/acOn.gif"
let teamid = "ksl9YPV"

function App() {
  const [bulb, setbulb] = useState(0)
  const [fan, setfan] = useState(0)
  const [led, setled] = useState("#fff")
  const [showledColorPicker, setshowledColorPicker] = useState(false)
  const [ac, setac] = useState({ state: 0, temp: 23 })
  const [acstate, setacstate] = useState(0)
  const [actemp, setactemp] = useState(23)
  const [showMessage, setShowMessage] = useState(false)
  useEffect(() => {
    (async () => {
      try {
        setShowMessage({ loading: true, message: "Loading.." })
        let res = await axios.get(`https://kodessphere-api.vercel.app/devices/${teamid}`)
        setShowMessage(false)
        setbulb(res.data.bulb)
        setfan(res.data.fan)
        setled(res.data.led)
        setac(res.data.ac)
        setacstate(res.data.ac.state)
        setactemp(res.data.ac.temp)
      } catch (error) {
        console.log(error)
        setShowMessage({ error: true, message: "Unable to fetch data!", dismissable: true })
      }
    })()
  }, [])
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
      const rawData = JSON.stringify({ teamid, device: "ac", value: { "temp": ac.temp, "state": evt.target.checked ? 1 : 0 } });
      let res = await axios.post(`https://kodessphere-api.vercel.app/devices`, rawData, { headers: { 'Content-Type': 'application/json' } })
      console.log(res)
      if (!res.data.success)
        throw new Error("")
      setacstate(evt.target.checked ? 1 : 0)
    } catch (error) {
      setShowMessage({ error: true, message: "Unable to update state!", dismissable: true })
    }
  }
  return (
    <>
      {showMessage && <MessageBox message={showMessage.message} error={showMessage.error} success={showMessage.success} loading={showMessage.loading} dismissable={showMessage.dismissable} setShowMessage={setShowMessage} />}
      <h1 className='text-center my-5'>Dementors</h1>
      <div className="container text-center">
        <div className="row justify-content-center">
          <div className="col-6 text-center">
            <div className="card" style={{ width: "20%" }}>
              <img role='button' src={bulb == 0 ? bulbOff : bulbOn} onClick={handleBulb} />
            </div>
          </div>
          <div className="col-6 text-center">
            <div className="card" style={{ minWidth: "20%" }}>
              <IoBulbSharp style={{ color: led == "#fff" ? "" : led ,width:"100%"}} onClick={() => { setshowledColorPicker(!showledColorPicker) }} />
              {showledColorPicker && <SketchPicker color={led} onChange={handleLed} />}
            </div>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-6">
            <img style={{ width: "30%" }} src={fan == 0 ? fanOff : fanOn} />
            <br />
            <Slider
              style={{ width: "30%" }}
              value={fan} step={1} max={5}
              valueLabelDisplay="auto"
              onChange={handleFan}
              marks={true}
            />
          </div>
          <div className="col-6">
            <img style={{ width: "30%" }} src={ac.state == 0 ? acOff : acOn} />
            <br />
            <Switch
              checked={acstate == 1}
              onChange={handleAcState}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </div>
        </div>
      </div>
      {/* <img role='button' src={bulb == 0 ? bulbOff : bulbOn} onClick={handleBulb} />
      <IoBulbSharp style={{ color: led == "#fff" ? "" : led }} onClick={() => { setshowledColorPicker(!showledColorPicker) }} />
      {showledColorPicker && <SketchPicker color={led} onChange={handleLed} />}
      <img src={fan == 0 ? fanOff : fanOn} />
      <Slider
        value={fan} step={1} max={5}
        valueLabelDisplay="auto"
        onChange={handleFan}
        marks={true}
      />
      <img src={ac.state == 0 ? acOff : acOn} />
      {acstate}
      <Switch
        checked={acstate == 1}
        onChange={handleAcState}
        inputProps={{ 'aria-label': 'controlled' }}
      /> */}
    </>
  )
}

export default App
