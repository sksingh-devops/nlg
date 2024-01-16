import React, { useEffect, useState } from "react";
import { initGA, logPageView } from './analytics';
import { initGAUniversal, logPageViewUniversal } from './analyticsuni';
import './App.css';
import Login from './Login/login';
import Signup from './signup/signup';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Forgot from './forgotPassword/forgot';
import Frontscreen from './FrontScreen/frontscreen';
import Userprofile from './userProfile/userprofile';
import Athletedashboard from './athlete/athletedashboard';
import Invite from './admin/invite';
import Program from "./programs/program";
import Staff from "./staff/staff";
import CalendarPage from "./calendar/calendar";
import Contact from "./contact/contact";
import Booklesson from "./bookLesson/booklesson";
import BookPractice from "./bookPractice/bookPractice";
import MonthlyChallenge from "./MonthlyChallenge/monthlyChallenge";
import Programeeditor from "./ProgramEditor/programeeditor";
import Collegedashboard from "./college/collegedashboard";
import CoachDashboard from "./coach/coachDashboard";
import ProfileDefault from "./aprofile/aprofile.jsx";
import SessionList from "./session/sessionlist";
import CoachAssign from "./admin/coachAssign";
import Chat from "./chat/chat";
import Member from "./member/member";
import Mainnotification from "./Notifica/mainnotification";
import AthleteTest from "./athlete/athleteTest";
import Lead from "./leaderboard/lead";
import AthleteAssignment from "./admin/athleteAssignment";
import Privacy from "./privacy/privacy";
import Partner from "./partners/partner.jsx";
import JRLeader from "./jrLeaderboard/jrlead.jsx";
import JRChallenge from "./jrChallengeTest/jrChallenge.jsx";
import Jrhtml from "./jrhtml/jrhtml.jsx";



function App() {
  const [userdata, setUserData] = useState({
    token: '',
    role: '',
    name:'',
    isLoggedIn: false
  });
  useEffect(() => {
    try {
      initGA();
      logPageView();
      initGAUniversal()
      logPageViewUniversal()
    } catch (error) {
      console.error(error)
    }

    const storedToken = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (storedToken) {
      setUserData({
        token: storedToken,
        role: role,
       
        isLoggedIn: true,
      })
    } else {
      setUserData({
        token: '',
        role: '',
       
        isLoggedIn: false,
      })
    }
  }, [localStorage]);
  const tokenStateChangehandler = (token, role) => {
    setUserData({
      token: token,
      role: role,
      isLoggedIn: Boolean(token),
    })
  }
  // const [inactive, setInactive] = useState(false);
  // let inactivityTimeout;

  // // Function to reload the page
  // const reloadPage = () => {
  //   window.location.reload();
  // };

  // // Function to reset the inactivity timer
  // const resetInactivityTimer = () => {
  //   clearTimeout(inactivityTimeout);

  //   inactivityTimeout = setTimeout(() => {
  //     setInactive(true);
  //     reloadPage();
  //   }, 20 * 60 * 1000); 
  // };

  // // Event handler to reset the inactivity timer on user activity
  // const handleActivity = () => {
  //   if (inactive) {
  //     setInactive(false);
  //     resetInactivityTimer();
  //   }
  // };

  // useEffect(() => {
  //   // Add event listener for user activity
  //   window.addEventListener('mousemove', handleActivity);
  //   // Start the inactivity timer
  //   resetInactivityTimer();
  //   // Clean up event listener on unmount
  //   return () => {
  //     window.removeEventListener('mousemove', handleActivity);
  //     clearTimeout(inactivityTimeout);
  //   };
  // }, []);

  return (
    <div>
    
      <BrowserRouter >
        <Routes>
          <Route path="/" element={<Frontscreen userdata={userdata} tokenStateChangeHandler={tokenStateChangehandler} />} />
          <Route path="/login" element={<Login tokenStateChangeHandler={tokenStateChangehandler} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/userprofile/:id?" element={<ProfileDefault userdata={userdata} />} />
          <Route path="/athletedashboard" element={<Athletedashboard userdata={userdata} />} />
          <Route path="/invite" element={<Invite userdata={userdata} />} />
          <Route path="/program" element={<Program userdata={userdata} />} />
          <Route path="/staff" element={<Staff userdata={userdata} />} />
          <Route path="/calendar" element={<CalendarPage userdata={userdata} />} />
          <Route path="/contact" element={<Contact userdata={userdata} />} />
          <Route path="/booklesson" element={<Booklesson userdata={userdata} />} />
          <Route path="/bookpractice" element={<BookPractice userdata={userdata} />} />
          <Route path="/monthlychallenge" element={<MonthlyChallenge userdata={userdata} />} />
          <Route path="/programeditor/:id" element={<Programeeditor userdata={userdata} />} />
          <Route path="/collegedashboard" element={<Collegedashboard userdata={userdata}  />} />
          <Route path="/coachdashboard" element={<CoachDashboard userdata={userdata}  />} />
          <Route path="/chat" element={<Chat userdata={userdata}  />} />
          <Route path="/contact-us" element={<Contact userdata={userdata}  />} />
          <Route path="/profile-ath/:id?" element={<ProfileDefault userdata={userdata}  />} />
          <Route path="/member" element={<Member userdata={userdata}  />} />
          <Route path="/notifications" element={<Mainnotification userdata={userdata}  />} />
          <Route path="/session" element={<SessionList isAdmin={true} userdata={userdata}  />} />
          <Route path="/task/:id?" element={<AthleteTest isAdmin={true} userdata={userdata}  />} />
          <Route path="/leader" element={<Lead isAdmin={true} userdata={userdata}  />} />
          <Route path="/partner" element={<Partner isAdmin={true} userdata={userdata}  />} />
          <Route path="/jrleader" element={<JRLeader isAdmin={true} userdata={userdata}  />} />
        { userdata.role==="admin"&& <Route path="/assignment/test/:id?" element={<AthleteAssignment isAdmin={true} userdata={userdata}  />} />}
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/jrchallenge" element={<JRChallenge isAdmin={true} userdata={userdata}  />} />
        <Route path="/jrleaderboard" element={<Jrhtml isAdmin={true} userdata={userdata}  />} />
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
