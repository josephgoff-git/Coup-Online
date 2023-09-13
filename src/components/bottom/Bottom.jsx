import React, { useState } from 'react'
import "./bottom.scss";
import { GoThreeBars } from 'react-icons/go'

const Bottom = () => {
  const [open, setOpen] = useState(false);
  
  const handleClick = () => {
    const bottom = document.getElementById("bottom");
    const bottomTop = document.getElementById("bottom-top");
    bottom.style.height = open? "50px": "calc(100vh - 180px)";
    bottomTop.style.borderTopRightRadius = open? "0px": "10px";
    bottomTop.style.borderTopLeftRadius = open? "0px": "10px";
    setOpen(!open);
  }

  return (
    <div id="bottom" className="bottom" onClick={handleClick}>
      
      <div id="bottom-top" className="bottom-top">
        <GoThreeBars onClick={()=>{handleClick()}} fontSize={30} className="ham" style={{display: "block"}}/>
      </div>
    
    </div>
  )
}

export default Bottom