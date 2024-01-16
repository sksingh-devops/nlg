import React from 'react'
import Navbar from '../navbar/navbar'
import Footer from '../footer/footer'
import { Card, Row } from 'antd'

const Partner = (props) => {
  return (
    <div>
      <Navbar userdata={props.userdata} />
      <div style={{ height:'80vh'}}>
        <h1 style={{fontFamily:'sans-serif', textAlign:'center', color:"green"}}> Our Partners</h1>
        <Row style={{ display: 'flex'  , gap: "10px" , margin:"10px"}}>
        <Card style={{ boxShadow:'0 0 20px rgba(0, 0, 0, 0.5)', marginTop:'50px'}}>
        <div style={{ display:'flex'  }}>
    <a href='https://neuropeakpro.com/' target='blank'>    <img src='/image/ntel.jpeg' alt='partnerImage' style={{ height:'200px', width: '200px'}}/></a>
      
        </div>
        </Card>
    <Card style={{ boxShadow:'0 0 20px rgba(0, 0, 0, 0.5)', marginTop:'50px'}}>
        <div style={{ display:'flex'  }}>
        <a href='https://golfforever.com/?sca_ref=4352278.4pOHakFJYD' target='blank'>    <img src='/image/golfForever.jpeg' alt='partnerImage' style={{ height:'200px', width: '200px'}}/></a>
   
      
        </div>
        </Card>
        </Row>
      </div>
      <Footer/>
    </div>
  )
}

export default Partner
