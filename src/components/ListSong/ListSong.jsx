import React from 'react'
import './listsong.css'
import ListButton from "../ButtonGroup/ListButton"
const ListSong = () => {
  return (
    <>
      <div className="list_song">
          <div className="col-12">
            <h5>
              <i className="fas fa-guitar fa-fw"></i>
              <a href="/chord">
                Nỗi buồn con gái
              </a>
              <small> &nbsp;<i className="fas fa-user"></i> Sáng tác:
                <a href="https://hopamviet.vn/chord/composer/101/thai-hung.html">Thái Hùng</a>
              </small>
            </h5>
            <em>
              Intro: <span className="chord">[Am]</span><span className="chord">[E7]</span><span className="chord">[Am]</span>-<span className="chord">[F]</span><span className="chord">[Am]</span><span className="chord">[E7]</span>
              1. Làm <span className="chord">[Am]</span> thân con gái khi trót <span className="chord">[Em]</span> yêu một người
              Niềm <span className="chord">[F]</span> thương nỗi nhớ giấu kín <span className="chord">[Dm]</span> sau môi cười
              Làm <span className="chord">[Dm]</span> thân con gái chỉ biết <span className="chord">[Am]</span> yêu mà thôi
              Chỉ biết <span className="chord">[Dm]</span> mơ…
            </em>
            <br />
            <small><span className="text-muted">Ca sĩ thể hiện: </span><em><a href="https://hopamviet.vn/chord/singer/Sơn Ca" className="csinger">Sơn Ca</a></em></small> 
            <a href="https://hopamviet.vn/chord/category/3/nhac-tre.html"><span className="float-right text-muted small">Nhạc Trẻ</span></a>
            <div className="clearfix"></div>
            <div style={{ backgroundColor: '#eee', border: '0', height: '1px', margin: '10px 0' }}></div>
          </div>
          <ListButton/>
        </div>
    </>
  )
}

export default ListSong
