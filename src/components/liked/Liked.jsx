import React, { useEffect } from 'react';
import $ from 'jquery'; // Make sure jQuery is imported
import NavbarTop from '../Navbar/Navbar';

const Liked = () => {
//   useEffect(() => {
//     // Initialize DataTable for likes
//     initializeDataTable();
//   }, []);

  // Function to initialize DataTable
//   const initializeDataTable = () => {
//     $('#likes').dataTable({
//       "language": {
//         "sProcessing": "Đang xử lý...",
//         "sLengthMenu": "Hiển thị _MENU_ bài",
//         "sZeroRecords": "Không tìm thấy kết quả nào",
//         "sInfo": "Đang xem _START_ đến _END_ trong tổng số _TOTAL_ bài",
//         "sInfoEmpty": "Đang xem 0 đến 0 trong tổng số 0 bài",
//         "sInfoFiltered": "(được lọc từ _MAX_ bài)",
//         "sSearch": "Tìm kiếm:",
//         "oPaginate": {
//           "sFirst": "Đầu",
//           "sPrevious": "Trước",
//           "sNext": "Tiếp",
//           "sLast": "Cuối"
//         }
//       },
//       "iDisplayLength": 50,
//       "columnDefs": [
//         { "width": "60%", "targets": 0 }
//       ]
//     });
//   };

  return (
    <>
    <div className="top"><NavbarTop/></div>
    <div className="container pt-3">
      <div className="row">
        <div className="col-lg-8">
          <div className="ct-box">
            <h3>Danh sách bài hát yêu thích</h3>
            <br />
            <div className="table-responsive">
              <div id="likes_wrapper" className="dataTables_wrapper dt-bootstrap4 no-footer">
                <div className="row">
                  <div className="col-sm-12 col-md-6">
                    <div className="dataTables_length" id="likes_length">
                      <label>Hiển thị 
                        <select name="likes_length" aria-controls="likes" className="custom-select custom-select-sm form-control form-control-sm">
                          <option value="10">10</option>
                          <option value="25">25</option>
                          <option value="50">50</option>
                          <option value="100">100</option>
                        </select> bài
                      </label>
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-6">
                    <div id="likes_filter" className="dataTables_filter">
                      <label>Tìm kiếm: <input type="search" className="form-control form-control-sm" placeholder="" aria-controls="likes" /></label>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-12">
                    <table className="table table-striped table-bordered table-hover dataTable no-footer" id="likes" role="grid" aria-describedby="likes_info" style={{ width: '706px' }}>
                      <thead>
                        <tr role="row">
                          <th className="sorting_asc" tabIndex="0" aria-controls="likes" rowSpan="1" colSpan="1" aria-sort="ascending" aria-label="Tên bài hát: activate to sort column descending" style={{ width: '380.2px' }}>Tên bài hát</th>
                          <th className="sorting" tabIndex="0" aria-controls="likes" rowSpan="1" colSpan="1" aria-label="Tác giả: activate to sort column ascending" style={{ width: '157.2px' }}>Tác giả</th>
                          <th className="sorting" tabIndex="0" aria-controls="likes" rowSpan="1" colSpan="1" aria-label="Xem: activate to sort column ascending" style={{ width: '41px' }}>Xem</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr role="row" className="odd">
                          <td className="sorting_1">
                            <a href="#" target="_blank" rel="noopener noreferrer">
                              <strong>TÌNH ĐỜI (DUYÊN KIẾP CẦM CA)</strong>
                            </a><br />
                            <em>1. Khi biết <span className="chord">[Dm]</span> em mang kiếp cầm <span className="chord">[F]</span> ca Đêm đêm...</em>
                          </td>
                          <td>
                            <a href="#">Minh Kỳ</a> &amp; <a href="#">Vũ Chương</a>
                          </td>
                          <td>227727</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-12 col-md-5">
                    <div className="dataTables_info" id="likes_info" role="status" aria-live="polite">Đang xem 1 đến 1 trong tổng số 1 bài</div>
                  </div>
                  <div className="col-sm-12 col-md-7">
                    <div className="dataTables_paginate paging_simple_numbers" id="likes_paginate">
                      <ul className="pagination">
                        <li className="paginate_button page-item previous disabled" id="likes_previous">
                          <a href="#" aria-controls="likes" data-dt-idx="0" tabIndex="0" className="page-link">Trước</a>
                        </li>
                        <li className="paginate_button page-item active">
                          <a href="#" aria-controls="likes" data-dt-idx="1" tabIndex="0" className="page-link">1</a>
                        </li>
                        <li className="paginate_button page-item next disabled" id="likes_next">
                          <a href="#" aria-controls="likes" data-dt-idx="2" tabIndex="0" className="page-link">Tiếp</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
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
      </div>
    </div></>
  
  );
}

export default Liked;
