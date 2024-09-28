import React, { useState } from 'react';
import './listbbutton.css';

const ListButton = () => {
  // Sử dụng useState để lưu trang hiện tại
  const [currentPage, setCurrentPage] = useState(1);

  // Hàm xử lý khi người dùng chọn một trang khác
  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className="pagging text-center">
        <nav>
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? 'active' : ''}`}>
              <span className="page-link" onClick={() => handlePageClick(1)}>
                <a href="#">1</a>
              </span>
            </li>
            <li className={`page-item ${currentPage === 2 ? 'active' : ''}`}>
              <span className="page-link" onClick={() => handlePageClick(2)}>
              <a href="#">2</a>
              </span>
            </li>
            <li className={`page-item ${currentPage === 3 ? 'active' : ''}`}>
              <span className="page-link" onClick={() => handlePageClick(3)}>
                <a href="#">3</a>
              </span>
            </li>
            <li className={`page-item ${currentPage === 4 ? 'active' : ''}`}>
              <span className="page-link" onClick={() => handlePageClick(4)}>
                <a href="#">4</a>
              </span>
            </li>
            <li className="page-item">
              <span className="page-link" onClick={() => handlePageClick(currentPage + 1)}>
                <a href="#">&gt;&gt;</a>
              </span>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default ListButton;
