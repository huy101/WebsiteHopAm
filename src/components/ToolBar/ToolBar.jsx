import React from 'react'
import './toolbar.css'
import { useSelector } from 'react-redux';
const ToolBar = () => {
  const { loading, error, songData } = useSelector(state => state.song); 
  return (
    <>
      <div id="toolbar" className="btn-toolbar">
<div className="btn-group mr-1">
<span className="btn btn-outline-secondary btn-sm" data-toggle="tooltip" data-placement="top" title="" onClick="changeStyle(document.getElementById('lyric'), 'b');" data-original-title="Giảm tone">b</span>
<span className="btn btn-outline-secondary btn-sm disabled" data-toggle="tooltip" data-placement="top" data-original-title="" title=""><span className="chord">[{songData.song.tone}]</span></span>
<span className="btn btn-outline-secondary btn-sm" data-toggle="tooltip" data-placement="top" title="" onClick="changeStyle(document.getElementById('lyric'), '#');" data-original-title="Tăng tone">#</span>
</div>
<div className="btn-group mr-1">
<span className="btn btn-outline-secondary btn-sm" data-toggle="tooltip" data-placement="top" title="" onClick="startScroll();" data-original-title="Tăng cuộn trang"><i className="fas fa-arrow-down"></i></span>
<span className="btn btn-outline-secondary btn-sm" data-toggle="tooltip" data-placement="top" title="" onClick="stopScroll();" data-original-title="Giảm cuộn trang"><i className="fas fa-arrow-up"></i></span>
</div>
<div className="btn-group mr-1">
<span id="fontsize" className="btn btn-outline-secondary btn-sm" data-toggle="tooltip" data-placement="top" title="" data-original-title="Cỡ chữ"><i className="fas fa-font fa-1x"></i></span>
<a href="https://hopamviet.vn/chord/printsong/suong-roi/W8IUA786.html" target="_blank" className="btn btn-outline-secondary btn-sm" data-toggle="tooltip" data-placement="top" title="" data-original-title="In"><i className="fas fa-print"></i></a>
<span id="clone" className="btn btn-outline-secondary btn-sm" data-toggle="tooltip" data-placement="top" title="" data-original-title="Nhân đôi lời">x2</span>
</div>
</div>
    </>
  )
}

export default ToolBar
