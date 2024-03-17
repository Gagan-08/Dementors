import { useEffect, useState } from 'react'
import axios from 'axios'
import MessageBox from './components/Messagebox'
import bulbOn from "./assets/bulbOn.png"
import bulbOff from "./assets/bulbOff.png"
import { IoBulbSharp } from "react-icons/io5";
import { SketchPicker } from 'react-color';
import fanOn from "./assets/fanOn.gif"
import fanOff from "./assets/fanOff.jpg"
import { Slider } from '@mui/material'
let teamid = "ksl9YPV"

function App() {
  const [bulb, setbulb] = useState(0)
  const [fan, setfan] = useState(0)
  const [led, setled] = useState("#fff")
  const [showledColorPicker, setshowledColorPicker] = useState(false)
  const [ac, setac] = useState({ state: 0, temp: 23 })
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
      } catch (error) {
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
        value: bulb==0?1:0
      });
      res = await axios.post(`https://kodessphere-api.vercel.app/devices`,rawData,{headers:{'Content-Type':'application/json'}})
      if (bulb == 0)
        setbulb(1)
      else 
        setbulb(0)
      console.log(res)
    } catch (error) {
      setShowMessage({ error: true, message: "Unable to update state!", dismissable: true })
    }
  }
  async function handleLed(color) {
    try {
      const rawData = JSON.stringify({ teamid, device: "led", value: color.hex });
      let res = await axios.post(`https://kodessphere-api.vercel.app/devices`,rawData,{headers:{'Content-Type':'application/json'}})
      setled(color.hex)
      setshowledColorPicker(false)
    } catch (error) {
      setShowMessage({ error: true, message: "Unable to update state!", dismissable: true })
    }
  }
  return (
    <>
      {showMessage && <MessageBox message={showMessage.message} error={showMessage.error} success={showMessage.success} loading={showMessage.loading} dismissable={showMessage.dismissable} setShowMessage={setShowMessage} />}
      <img role='button' src={bulb == 0 ? bulbOff : bulbOn} onClick={handleBulb} />
      <IoBulbSharp style={{ color: led == "#fff" ? "" : led }} onClick={() => { setshowledColorPicker(!showledColorPicker) }} />
      {showledColorPicker && <SketchPicker color={led} onChange={handleLed} />}
      <img src={fan == 0 ? fanOff : fanOn} />
      <Slider
        aria-label="Restricted values"
        defaultValue={fan}
        step={1}
        max={5}
        valueLabelDisplay="auto"
        marks={true}
      />
    </>
  )
}

export default App
