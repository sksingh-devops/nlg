import React from 'react'
import styles from './mainnotification.module.css'
import Navbar from '../navbar/navbar'
import Notifications from '../coach/notifications'
import Footer from "../footer/footer";
const Mainnotification = (props) => {
  return (
    <div className={styles.mainContainer}>
     <Navbar userdata={props.userdata} />
     <div className={styles.notificationContainer}>
        <div className={styles.centerNotifyCOntainer}>
        <Notifications/>
        </div>
     </div>
     <Footer />
    </div>
  )
}

export default Mainnotification
