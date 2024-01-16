import React, { useState, useRef, useEffect } from 'react';
import './coverphoto.css'
import { RiImageEditLine } from 'react-icons/ri';
import { HiPencil } from 'react-icons/hi';
import { getBaseUrl } from "../config/apiconfig";
import "toastr/build/toastr.min.css";
import axios from "axios";
import toastr from "toastr";
function CoverPhoto(props) {
    const { isReadOnly, coverImage, into, profileImage, backupimg } = props
                        
    let ci = coverImage ? `${getBaseUrl()}/${coverImage}` : '/image/gf.jpeg'
    const [coverImages, setCoverImage] = useState(ci);
    let pi = profileImage ? `${getBaseUrl()}/${profileImage}` : backupimg
    const [profileImages, setProfileImage] = useState(pi);

    const fileInputRef = useRef(null);
    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const profileImageUpload = async (event) => {
        const file = event.target.files[0];
        const storedToken = localStorage.getItem("token");
        fileInputRef.current.value = null;
        const formData = new FormData();
        formData.append('profilePicture', file);
        const profileurl = `${getBaseUrl()}/profile/profilepic`
        try {
            const response = await axios.post(
                profileurl,
                formData,
                {
                    headers: {
                        authorization: storedToken,
                    },
                }
            );
            const path = response?.data?.path || "";
            setProfileImage(`${getBaseUrl()}/${path}`)
        } catch (error) {
            console.error(error);
            toastr.clear();
            toastr.error(`Image Not Uploaded`);
        } finally {
            fileInputRef.current.value = null;
        }
    };

    useEffect(() => {
        let pi = profileImage ? `${getBaseUrl()}/${profileImage}` : backupimg 
        setProfileImage(pi);
    }, [backupimg,profileImage]); // This effect will run whenever coverImage changes
    useEffect(() => {
        // Update the coverImages state when the coverImage prop changes
        let ci = coverImage ? `${getBaseUrl()}/${coverImage}` : '/image/gf.jpeg'
        setCoverImage(ci);
    }, [coverImage]); // This effect will run whenever coverImage changes
    return (
        <div className="cover-photo-container">
            {coverImages ? (
                <img src={coverImages} className='cover-pic' alt="Next Level Golf" />
            ) : (
                <div className="no-cover-photo-placeholder">
                    {/* This is the placeholder content for the cover photo */}
                    <div className="cover-placeholder">
                        <p>|||</p>
                        <p>Add a cover photo to personalize your profile.</p>
                    </div>

                    {/* The file input for uploading a new cover photo */}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={profileImageUpload}
                        className="cover-photo-input"
                    />
                </div>
            )}

            <input
                type="file"
                onChange={profileImageUpload}
                accept="image/png"
                max="5000000"
                ref={fileInputRef}
                style={{ display: "none" }}
            />
            <div className='overlay-div'>
                {!isReadOnly && <div className='cover-edit'>
                    <RiImageEditLine style={{
                        cursor: 'pointer',
                        color: "white",
                    }} size={25} title='Change Profile Picture (PNG) ' onClick={handleImageClick} />
                </div>}
                <div className="label">
                    <div className="text-wrapper">NLG MEMBER SINCE 2023</div>
                    <div className="text-wrapper-2" style={{
                        textTransform: 'uppercase'
                    }}>{into?.name || '+1 -'}</div>
                </div>
                <div>
                    { profileImages ?  <img src={profileImages} onClick={handleImageClick} className='profile-pic' alt="Next Level Golf" />
                       :
                      ( <div
                        className='profile-pic'
                        style={{  
                          display:"flex",
                         alignItems:"center",
                         justifyContent:"center",
                        }} ><div
                        
                          style={{  
                            display:"flex",
                         justifyContent:"center",
                         opacity:"0.5",
                          
                            width: "100px",
                            height: "100px",
                            objectFit: "contain",
                            backgroundColor: "orange",
                            textAlign: "center",
                            alignItems:"center",
                            fontSize: "50px",
                            color: "white",
                          }}
                          
                        > {into?.name?.charAt(0) || into?.email?.charAt(0)}</div></div>)
                        }
                </div>
                <div>
                    <div class="container">
                        <div class="row another-class">
                            <div class="col-md-3 col-sm-3 col-xs-3 cover-holder cover-holder-1 line-border">
                                <div className='cover-label-top'>CLASS OF</div>
                                <div className='cover-label-bottom'>{into?.graduationyear || '-'}</div>
                            </div>
                            <div class="col-md-3 col-xs-3 cover-holder line-border">
                                <div className='cover-label-top'>JGSR</div>
                                <div className='cover-label-bottom'>{into?.JGSR || '-'}</div>
                            </div>
                            <div class="col-md-6 col-xs-3 cover-holder">
                                <div className='cover-label-top'>ST/PROV</div>
                                <div className='cover-label-bottom'>{into?.state || '--'}</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default CoverPhoto;