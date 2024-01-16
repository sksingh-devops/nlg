import React, { useEffect } from "react";
import Navbar from "../navbar/navbar";
import styles from "./staff.module.css";
import Footer from "../footer/footer";
const Staff = (props) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div>
        <Navbar userdata={props.userdata} />
      <div className={styles.mainContainer}>
        <img
          className={styles.mainImage}
          src="/image/staff.webp"
          alt="programImg"
        />
        <div className={styles.overFlowContainer}>
          <h1>
            {" "}
            <span>STAFF</span>
          </h1>
          <div>
            <p>
              <span>
                NEXT LEVEL GOLF Coaches that have played and taught at the
                highest level. The staff will be dedicated to equipping you with
                tools that fit your game to help you perform when it matters.
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className={`row ${styles.container2}`}>
        <div className={`col ${styles.mainLeft}`}>
          <div className={styles.container2Left}>
            <img
              src="/image/Coach_Louis 1.webp"
              alt="nlg staff"
              height={522}
              width={691}
            />
            <div className={styles.container2LeftSpan}>
              <p className={styles.container2LeftSpanText}>
                ”It doesn't get much better than helping golfers reach heights
                in their game they didn't think possible.”
              </p>
            </div>
            <div className={`col ${styles.container2LeftPDiv}`}>
              <p>
                <span className={styles.container2LeftPDivspan}>
                  Lesson Rates:
                </span>
              </p>
              <p>$250 per hour for adults</p>
              <p>$150 per hour for juniors</p>
              <p>10 Lesson Package $2,000</p>
            </div>
            <div
             className={styles.Container2imageButton}
              id="comp-lcc8cjqj"
              aria-disabled="false"
            >
              <a
                data-testid="linkElement"
                href="https://momence.com/Louis-Sauer-Golf/appointment-reservation/7619?boardId=194"
                target="_blank"
                rel="noreferrer noopener"
                class="TFOeq0 wixui-button zKbzSQ"
                aria-disabled="false"
              >
                <span class="kclxHl wixui-button__label">
                  Schedule A Lesson
                </span>
              </a>
            </div>
          </div>
        </div>
        <div className={`col ${styles.mainRight}`}>
          <div className={styles.container2Right}>
            <div className={styles.container2RightInner}>
          <span className={`${styles.container2RightSpan}`}>LOUIS SAUER</span>
          <div className={styles.blankdiv}></div>
          <div className={styles.container2Righth4container}>
          <h4>Next Level Golf Founder</h4>
          <h4>PGA Instructor of Year 2017 | 25+ Teaching Experience</h4>
          </div>
          <div className={`${styles.container2RightPDiv}`}>
            <p className="text-v-gop">
              After graduating from the Professional Golf Management program at
              Ferris State University in Big Rapids, Michigan, Louis played a
              number of years on mini-tours. He had the good fortune of working
              for and studying under world-renowned golf instructor, Jim McLean,
              and soon became a Lead/Master Instructor for the Jim McLean Golf
              School, the number one golf school in the world. He also trained
              with other top golf instructors: Butch Harmon, Hank Haney, Mike
              Adams, Phil Rogers, and Carl Welty. With a desire to improve his
              own skills and teach at the highest possible level. Louis obtained
              certifications from the C.H.E.K Institute for golf performance,
              Golf Psych, and Zen golf. Additionally, Louis became a certified
              instructor for top performance coach, Tony Robbins.
            </p>
            <p className="text-v-gop">
              {" "}
              Louis is also trained in working with all the latest state-of-the
              art technologies designed to improve key golfing techniques
              including, but not limited to: swing mechanics, ball-flight
              analysis, biofeedback training of the mind as it relates to
              performance, and other measurement tools to help enhance the
              overall game.
            </p>
            <p className="text-v-gop">
              Known throughout the country as a top instructor with a 100%
              commitment to developing winners. Louis has the ability to craft
              an accurate and detailed analysis of all aspects of the game. As
              the Owner of LSGOLF in Northbrook, IL, Louis helps hundreds of
              golfers, find better, faster and easier ways to hone their skills
              and get the results they want to improve their game.
            </p>
          </div>
          </div>
          </div>
        </div>
      </div>
      {/* container 3 */}

      <div className={`row ${styles.container3}`}>
        <div className={`col ${styles.container3InnerContainer}`}>
          <div className={`row ${styles.container3h3}`}>
            <h3>NEXT LEVEL GOLF STAFF</h3>
          </div>

          <div className={`row ${styles.container3Box}`}>
            <div className={`${styles.boxLeftDiv}`}>
              <img src="/image/Coach_Chuhan 1.webp" alt="image" />
            </div>
            <div className={`col ${styles.boxRightDiv}`}>
              <div className="col">
                <p> Chuhan Lee</p>
                <span>
                  {" "}
                  GOLF INSTRUCTOR SINCE 2002 | PROFESSIONAL GOLF CAREERS COLLEGE
                </span>
              </div>
              <div className={`col ${styles.boxRightDivintro}`} >
                <span>
                  {" "}
                  Chuhan has been a coach for over 20 years, dedicated to
                  developing junior golfers throughout Chicagoland. He is
                  considered one of the top junior coaches in the Northshore
                  with students being ranked internationally. Chuhan received
                  his teaching degree from the Professional Golfers Career
                  College and has worked across many golf clubs in the midwest.
                  His students are known for their work ethic, strong golf IQs,
                  and performance in junior tournaments.
                </span>
                <p style={{ marginTop: "20px" }}>
                  {" "}
                  Rate: $130 per hour / $65 per 30 min
                </p>
              </div>
              <div className={styles.allBoximageButton}>
                <a
                  href="https://momence.com/Louis-Sauer-Golf/appointment-reservation/7619?boardId=194"
                  target="_blank"
                >
                  Schedule A Lesson
                </a>
              </div>
            </div>
          </div>

          <div className={`row ${styles.container3Box}`}>
            <div className={`${styles.boxLeftDiv}`}>
              <img src="/image/CoachDaniel 1.webp" alt="image" />
            </div>
            <div className={`col ${styles.boxRightDiv}`}>
              <div className="col">
                <p> Daniel Cole</p>
                <span> PGA INSTRUCTOR SINCE 2019</span>
              </div>
              <div className="col" style={{ marginTop: "30px" }}>
                <span>
                  {" "}
                  Daniel Cole has been a student of the game for the last
                  fifteen years. A four-year member of the Illinois Wesleyan
                  Men’s Golf Team. He was one of six players nationally to be
                  chosen to the Golf Coaches Association of America Division III
                  All-Freshman Team, in addition to being named GCAA All-Central
                  Region and Illinois Wesleyan University freshman of the year.
                  He won the IWU Invitational that year, topping a field of 111
                  golfers. Contact: 847.707.6600 | @dcolegolf
                </span>
                <p style={{ marginTop: "20px" }}>
                  {" "}
                  Adult : $150 per hour / $650 for 5 Lesson Package / $1200 for
                  10 Lesson Package
                </p>
                <p style={{ marginTop: "10px" }}>
                  {" "}
                  Junior : $120 per hour / $525 for 5 Lesson Package
                </p>
              </div>
              <div className={styles.allBoximageButton}>
                <a
                  href="https://momence.com/Louis-Sauer-Golf/appointment-reservation/7619?boardId=194"
                  target="_blank"
                >
                  Schedule A Lesson
                </a>
              </div>
            </div>
          </div>
          <div className={`row ${styles.container3Box}`}>
            <div className={` ${styles.boxLeftDiv}`}>
              <img src="/image/Coach_Eric 1.webp" alt="image" />
            </div>
            <div className={`col ${styles.boxRightDiv}`}>
              <div className="col">
                <p> Eric Meierdierks</p>
                <span> PGA INSTRUCTOR SINCE 2020</span>
              </div>
              <div className="col" style={{ marginTop: "30px" }}>
                <span>
                  {" "}
                  Eric is not only an instructor, but he was a 2013 PGA Tour
                  Member, a 2017 Web.com Tour Member, and a winner of 25+
                  Tournaments throughout his career. Born and raised in Chicago,
                  Eric played college golf at Michigan State University and was
                  a stand-out junior golfer that attended New Trier High School
                  in Wilmette, IL.
                </span>
                <p style={{ marginTop: "20px" }}>
                  {" "}
                  Adult : $150 per hour / $650 for 5 Lesson Package / $1200 for
                  10 Lesson Package
                </p>
                <p style={{ marginTop: "10px" }}>
                  {" "}
                  Junior : $120 per hour / $525 for 5 Lesson Package
                </p>
              </div>
              <div className={styles.allBoximageButton}>
                <a
                  href="https://momence.com/Louis-Sauer-Golf/appointment-reservation/7619?boardId=194"
                  target="_blank"
                >
                  Schedule A Lesson
                </a>
              </div>
            </div>
          </div>
          <div className={`row ${styles.container3Box}`}>
            <div className={`col ${styles.boxLeftDiv}`}>
              <img src="/image/Coach_Gabe 1.webp" alt="image" />
            </div>
            <div className={`col ${styles.boxRightDiv}`}>
              <div className="col">
                <p> Gabe Adducci</p>
                <span> PGA INSTRUCTOR SINCE 1996</span>
              </div>
              <div className="col" style={{ marginTop: "30px" }}>
                <span>
                  {" "}
                  Gabe has a degree from the Professional Golf Management
                  Program at Ferris State University
                </span>
                <ul>
                  {" "}
                  <li>Ferris State University Golf Team 1990</li>
                  <li>
                    Head Golf Professional – Country Club of Beloit 1996 – 2001,
                    Green Acres Country Club 2002 – 2017
                  </li>
                  <li>Given over 15,000 golf lessons</li>
                </ul>
              </div>
              <div className={styles.allBoximageButton}>
                <a
                  href="https://momence.com/Louis-Sauer-Golf/appointment-reservation/7619?boardId=194"
                  target="_blank"
                >
                  Schedule A Lesson
                </a>
              </div>
            </div>
          </div>
          <div className={`row ${styles.container3Box}`}>
            <div className={`col ${styles.boxLeftDiv}`}>
              <img src="/image/brian.jpeg" alt="image" />
            </div>
            <div className={`col ${styles.boxRightDiv}`}>
              <div className="col">
                <p>Brian Ohr </p>
                <span> Professional Golfer</span>
              </div>
              <div className="col" style={{ marginTop: "30px" }}>
                <span>
                  {" "}
                  Brian Ohr has had a career in competitive golf for the last 20 years at the junior, amateur and professional level. Born and raised in Northbrook, IL, he claimed the Individual Class 3A State Title in 2013 playing for Glenbrook North along with qualifying for the U.S Junior Amateur Championship in 2013. He went on to compete at the Division 1 level at Miami University, winning 1 individual collegiate event, had 3x All MAC Second Team honors, and also qualified with medalist honors for 3 U.S Amateur Championships in 2016, 2017, and 2018. In his 4 year professional career, Brian earned status on the PGA Latinoamerica Tour and placed 5th at the Estrella Del Mar Open earning world ranking points and placing him in the WGR as a world ranked professional golfer. 
                </span>
                {/* <ul>
                  {" "}
                  <li>Ferris State University Golf Team 1990</li>
                  <li>
                    Head Golf Professional – Country Club of Beloit 1996 – 2001,
                    Green Acres Country Club 2002 – 2017
                  </li>
                  <li>Given over 15,000 golf lessons</li>
                </ul> */}
              </div>
              <div className={styles.allBoximageButton}>
                <a
                  href="https://momence.com/Louis-Sauer-Golf/appointment-reservation/7619?boardId=194"
                  target="_blank"
                >
                  Schedule A Lesson
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Staff;
