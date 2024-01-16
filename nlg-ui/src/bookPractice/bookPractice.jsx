import React from 'react'
import Footer from '../footer/footer'
import Navbar from '../navbar/navbar'

const BookPractice = (props) => {
  return (
    <div>
       <Navbar userdata={props.userdata}/>

<h1 style={{ textAlign:"center"}}>Book Practice Coming Soon</h1>
<Footer/>
    </div>
  )
}

export default BookPractice
