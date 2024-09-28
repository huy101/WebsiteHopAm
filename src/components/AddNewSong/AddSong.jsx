import React from 'react';
import NavbarTop from '../Navbar/Navbar';

const AddSong = () => {
  return (
    <><div className="top">
        <NavbarTop/>
    </div>
    <div className="container">
      <h3>Thêm bài hát mới</h3>
      <form>
        {/* Row 1 */}
        <div className="row mb-3">
          <div className="col-12">
            <div className="form-group">
              <label htmlFor="title1">Tên bài hát (*)</label>
              <input type="text" name="title1" className="form-control" />
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="row mb-3">
          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="composer1">Nhạc sĩ 1</label>
              <input type="text" name="composer1" id="composer1" className="form-control author" />
              <span className="help-block">
                <em>Nhạc sĩ sáng tác ca khúc</em>
              </span>
            </div>
          </div>

          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="composer2">Nhạc sĩ 2</label>
              <input type="text" name="composer2" id="composer2" className="form-control author" />
              <span className="help-block">
                <em>Nhạc sĩ khác cùng sáng tác</em>
              </span>
            </div>
          </div>

          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="composer3">Tác giả thơ</label>
              <input type="text" name="composer3" id="composer3" className="form-control author" />
              <span className="help-block">
                <em>Tên tác giả thơ (nếu có)</em>
              </span>
            </div>
          </div>

          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="composer4">Lời Việt</label>
              <input type="text" name="composer4" id="composer4" className="form-control author" autoComplete="off" />
              <span className="help-block">
                <em>Đối với nhạc Ngoại</em>
              </span>
            </div>
          </div>
        </div>

        {/* Add more form rows here */}
        <div className="row mb-3">
      {/* Thể loại */}
      <div className="col-md-4">
        <div className="form-group">
          <label htmlFor="category">Thể loại</label>
          <select name="category" className="form-control">
            <option value="1">Nhạc Vàng</option>
            <option value="2">Nhạc Trữ tình</option>
            <option value="3" selected>Nhạc Trẻ</option>
            <option value="4">Nhạc Quê hương</option>
            <option value="5">Nhạc Ngoại lời Việt</option>
            <option value="6">Nhạc Đỏ</option>
            <option value="7">Nhạc Dân ca</option>
            <option value="8">Nhạc Quốc tế</option>
            <option value="9">Nhạc Học trò</option>
            <option value="10">Nhạc Thiếu nhi</option>
            <option value="11">Nhạc Thánh ca</option>
            <option value="12">Nhạc Phật giáo</option>
            <option value="13">Nhạc Chế - Vui</option>
          </select>
        </div>
      </div>

      {/* Năm sáng tác */}
      <div className="col-md-4">
        <div className="form-group">
          <label htmlFor="year">Năm sáng tác (nếu biết)</label>
          <input type="text" name="year" id="year" className="form-control" />
        </div>
      </div>

      {/* Tone chủ bài hát */}
        <div className="col-md-4">
            <div className="form-group">
            <label htmlFor="tone">Tone chủ bài hát</label>
            <input type="text" name="tone" id="tone" className="form-control" />
            </div>
        </div>
        </div>
        </form>
        <div className="form-group">
      <label htmlFor="lyric">Lời và hợp âm (*)</label>
      <textarea
        rows="10"
        cols="3"
        name="lyric"
        id="lyric"
        className="form-control"
        required
      ></textarea>
      <span className="help-block text-danger">
        <em>Hợp âm phải bỏ trong dấu ngoặc vuông []. Thông tin ca sĩ thể hiện và link bài hát để ở dưới cùng</em>
      </span>
    </div>  
    </div>
    </>
    
  );
};

export default AddSong;
