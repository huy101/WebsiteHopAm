import React from 'react'
import NavbarTop from '../Navbar/Navbar'
import "./posted.css"
const Posted = () => {
  return (
    <>
    <div className="top">
        <NavbarTop/>
    </div>
    <div className="contain_posted">
    <div className="col-lg-8">
<div className="ct-box">
<h5><strong>Danh sách bài hát đã đăng <span className="badge badge-secondary">0</span></strong></h5>
</div>
</div>
      <div className="ct-box">
<h5><strong>Thông tin cá nhân</strong></h5>
<div className="row">
<div className="col-md-3">
<i className="fa fa-user fa-5x"></i>
</div>
<div className="col-md-9">
Xin chào <strong>huytapcode</strong>
</div>
</div>
</div>
    </div>
   
    </>
  )
}

export default Posted
