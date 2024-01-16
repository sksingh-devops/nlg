import React from "react";
import "./social.css";

export const SocialBox = (props) => {
    const { oneditcilck, isReadOnly, into } = props
    return (
        <div>
            <div className="socialbox">
                <div class="">
                    <div class="row">
                        <div class="col-md-2  soocialcover-holder soocialcover-holder-1 soocialline-border">
                            <div className='soocialcover-label-top'>Phone</div>
                            <div className='soocialcover-label-bottom'>{into?.phone || '--'}</div>
                        </div>
                        <div class="col-md-4 soocialcover-holder soocialline-border">
                            <div className='soocialcover-label-top'>Email</div>
                            <div className='soocialcover-label-bottom'>{into?.email || '--'}</div>
                        </div>
                        <div class="col-md-4 soocialcover-holder">
                            <div className='soocialcover-label-top'>Social</div>
                            <div className='soocialcover-label-bottom'>{into?.social || '--'}</div>
                        </div>
                       { isReadOnly &&<div className="col-md-1 offset-md-1 offset-xs-0  social-follow-parent">
                            <div class="social-follow">
                                <span> FOLLOW </span>
                            </div>

                        </div>}
                        {!isReadOnly && <div className="col-md-1 offset-md-1 offset-sm-0 social-follow-parent">
                            <div class="social-follow" onClick={() => {
                                oneditcilck()
                            }}>
                                <span>EDIT</span>
                            </div>
                        </div>}
                    </div>
                </div>
            </div>
            <div className="acabox">
                <div class="">
                    <div class="row">
                        <div class="col-md-6 col-sm-12 ">
                            <div class="col-md-12 col-sm-12 no-left-margin">
                                <span className="acabox-aca">ACADEMICS</span>
                            </div>
                            <div class="row">
                                <div class="col-md-3 acabox-holder acabox-holder-1 acabox-border">
                                    <div className='acabox-label-top'>SAT</div>
                                    <div className='acabox-label-bottom'>{into?.satOverall || '--'}</div>
                                </div>
                                <div class="col-md-3 acabox-holder acabox-border">
                                    <div className='acabox-label-top'>ACT</div>
                                    <div className='acabox-label-bottom'>{into?.act || '--'}</div>
                                </div>
                                <div class="col-md-3 acabox-holder acabox-border">
                                    <div className='acabox-label-top'>G.P.A. (Weighted)</div>
                                    <div className='acabox-label-bottom'>{into?.gpa || '--'}</div>
                                </div>
                                <div class="col-md-3 acabox-holder">
                                    <div className='acabox-label-top'>G.P.A. (Unweighted)</div>
                                    <div className='acabox-label-bottom'>{into?.gpauw || '--'}</div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-5 offset-md-1 col-sm-12">
                            <div class="col-md-12 col-sm-12 no-left-margin ">
                                <span className="acabox-aca">ATHLETE PROFILE</span>
                            </div>
                            <div class="row">
                                <div class="col-md-3 acabox-holder acabox-holder-1 acabox-border">
                                    <div className='acabox-label-top'>DRIVER SWING SPEED</div>
                                    <div className='acabox-label-bottom'>{into?.swing || '-'}</div>
                                </div>
                                <div class="col-md-3 acabox-holder acabox-border">
                                    <div className='acabox-label-top'>HEIGHT</div>
                                    <div className='acabox-label-bottom'>{into?.height || '--'}</div>
                                </div>
                                <div class="col-md-3 acabox-holder">
                                    <div className='acabox-label-top'>LOW ROUND</div>
                                    <div className='acabox-label-bottom'>{into?.lr || '-'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SocialBox;