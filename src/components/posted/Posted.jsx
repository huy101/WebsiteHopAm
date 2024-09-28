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
    <div class="col-lg-8">
<div class="ct-box">
<h5><strong>Danh sách bài hát đã đăng <span class="badge badge-secondary">0</span></strong></h5>
</div>
</div>
      <div class="ct-box">
<h5><strong>Thông tin cá nhân</strong></h5>
<div class="row">
<div class="col-md-3">
<i class="fa fa-user fa-5x"></i>
</div>
<div class="col-md-9">
Xin chào <strong>huytapcode</strong>
</div>
</div>
</div>
    </div>
   
    </>
  )
}

export default Posted
