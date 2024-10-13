import React from 'react';
import NavbarTop from '../Navbar/Navbar';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './home.css';
import ListMonth from '../month/ListMonth';
import ListSong from '../ListSong/ListSong';
import Post from '../TuLieu/Post';
import ListComments from '../comments/ListComment';



const Home = () => {
  return (
    <>
      <div className="top">
        <NavbarTop />
      </div>
      
      <div className="center">
        <div className="center_contain">
          <div className="ct-heading">
            <a href="https://hopamviet.vn/chord/latest.html">BÀI HÁT MỚI ĐĂNG</a>
          </div>

          <div className="center_ct2">
            <div className="rowright">
              <ListSong />
              <div className="mx-auto pt-2">
                <a href="https://hopamviet.vn/chord/latest/10.html" className="btn btn-outline-primary btn-sm">
                  Xem thêm
                </a>
              </div>
              <Post />
            </div>

            <div className="month">
              <ListMonth />
            </div>
          </div>
        </div>
      </div>
      <div className="bottom">
        <ListComments/>
      </div>
    </>
  );
};

export default Home;
