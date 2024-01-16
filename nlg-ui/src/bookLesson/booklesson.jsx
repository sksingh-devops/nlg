import React from 'react'
import Footer from '../footer/footer'
import Navbar from '../navbar/navbar'

const Booklesson = (props) => {
  return (
    <div>
      <Navbar userdata={props.userdata}/>

<h1 style={{ textAlign:"center"}}>Book Lesson Coming Soon</h1>
<Footer/>
    </div>
  )
}

export default Booklesson
