import React from 'react';
import  './listcomments.css'
const ListComments = () => {
  return (
    <div className="ct-box">
      <div className="ct-heading">
        <a href="https://hopamviet.vn/info/comments.html"> BÌNH LUẬN MỚI</a> 
        <a href="https://hopamviet.vn/info/comments.html" className="float-right">
          <em>Xem thêm <i className="fa fa-arrow-right"></i></em>
        </a>
      </div>
      
      <div className="row">
        <div className="col-md-6 col-xs-12">
          <div style={{ padding: '5px' }}>
            <a href="https://hopamviet.vn/chord/song/biet-khuc/W8IUIBEF.html">Biệt khúc</a>
          </div>
          <small>
            <em>
              <strong>Tân minh: </strong>QTV hợp âm viet cho mình xin tone ca sĩ Trọng Bắc hát ca khúc này ạ. Cảm ơn nhiều .
            </em> 
            <br />
            <span className="text-muted"> 
              <i className="fa fa-clock-o"></i> 57 phút trước
            </span>
          </small>
        </div>

        <div className="col-md-6 col-xs-12">
          <div style={{ padding: '5px' }}>
            <a href="https://hopamviet.vn/chord/song/vui-len-nhe-co-dau/W8IUAUA0.html">Vui lên nhé cô dâu</a>
          </div>
          <small>
            <em>
              <strong>Tuan man: </strong>Bài này mình đánh điệu gì bạn oi
            </em> 
            <br />
            <span className="text-muted"> 
              <i className="fa fa-clock-o"></i> 2 giờ trước
            </span>
          </small>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 col-xs-12">
          <div style={{ padding: '5px' }}>
            <a href="https://hopamviet.vn/chord/song/roi-mai-toi-dua-em/W8IUIIU6.html">Rồi mai tôi đưa em</a>
          </div>
          <small>
            <em>
              <strong>intrepid: </strong>@Đình Sưu: Tuấn Dũng hát tone Eb nhé.
            </em> 
            <br />
            <span className="text-muted"> 
              <i className="fa fa-clock-o"></i> 5 giờ trước
            </span>
          </small>
        </div>

        <div className="col-md-6 col-xs-12">
          <div style={{ padding: '5px' }}>
            <a href="https://hopamviet.vn/chord/song/roi-mai-toi-dua-em/W8IUIIU6.html">Rồi mai tôi đưa em</a>
          </div>
          <small>
            <em>
              <strong>Đình Sưu: </strong>Có bạn nào có hợp âm tone của Tuấn Dũng hát ko nhỉ
            </em> 
            <br />
            <span className="text-muted"> 
              <i className="fa fa-clock-o"></i> 6 giờ trước
            </span>
          </small>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 col-xs-12">
          <div style={{ padding: '5px' }}>
            <a href="https://hopamviet.vn/chord/song/ngay-xua-len-nam-len-ba/W8IUIAOD.html">Ngày xưa lên năm lên ba</a>
          </div>
          <small>
            <em>
              <strong>intrepid: </strong>@THỤY HƯỜNG: Bạn vào nút sheet bên phải tiêu đề bài hát để tải sheet nhé.
            </em> 
            <br />
            <span className="text-muted"> 
              <i className="fa fa-clock-o"></i> 6 giờ trước
            </span>
          </small>
        </div>

        <div className="col-md-6 col-xs-12">
          <div style={{ padding: '5px' }}>
            <a href="https://hopamviet.vn/chord/song/ngay-xua-len-nam-len-ba/W8IUIAOD.html">Ngày xưa lên năm lên ba</a>
          </div>
          <small>
            <em>
              <strong>THỤY HƯỜNG: </strong>cho tôi xin bản nhạc Ngày xưa lên năm lên ba của Trần tử thiêng nguyên bài có nhạc để tập hát.
            </em> 
            <br />
            <span className="text-muted"> 
              <i className="fa fa-clock-o"></i> 11 giờ trước
            </span>
          </small>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 col-xs-12">
          <div style={{ padding: '5px' }}>
            <a href="https://hopamviet.vn/chord/song/bai-tinh-cho-giai-nhan/W8IUI8ZA.html">Bài tình cho giai nhân</a>
          </div>
          <small>
            <em>
              <strong>hungphamdoan: </strong>1. Con trăng rất <span className="chord">[C]</span> già mà còn hào <span className="chord">[Am]</span> hoa…
            </em> 
            <br />
            <span className="text-muted"> 
              <i className="fa fa-clock-o"></i> 12 giờ trước
            </span>
          </small>
        </div>

        <div className="col-md-6 col-xs-12">
          <div style={{ padding: '5px' }}>
            <a href="https://hopamviet.vn/chord/song/hue-va-em/W8IUIABI.html">Huế và em</a>
          </div>
          <small>
            <em>
              <strong>Thu hai: </strong>Đánh điệu blue dc nha mn
            </em> 
            <br />
            <span className="text-muted"> 
              <i className="fa fa-clock-o"></i> 15 giờ trước
            </span>
          </small>
        </div>
      </div>
    </div>
  );
}

export default ListComments;
