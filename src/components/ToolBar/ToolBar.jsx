import React from 'react'
import './toolbar.css'
const ToolBar = () => {
  return (
    <>
      <div id="toolbar" class="btn-toolbar">
<div class="btn-group mr-1">
<span class="btn btn-outline-secondary btn-sm" data-toggle="tooltip" data-placement="top" title="" onclick="changeStyle(document.getElementById('lyric'), 'b');" data-original-title="Giảm tone">b</span>
<span class="btn btn-outline-secondary btn-sm disabled" data-toggle="tooltip" data-placement="top" data-original-title="" title=""><span class="chord">[Em]</span></span>
<span class="btn btn-outline-secondary btn-sm" data-toggle="tooltip" data-placement="top" title="" onclick="changeStyle(document.getElementById('lyric'), '#');" data-original-title="Tăng tone">#</span>
</div>
<div class="btn-group mr-1">
<span class="btn btn-outline-secondary btn-sm" data-toggle="tooltip" data-placement="top" title="" onclick="startScroll();" data-original-title="Tăng cuộn trang"><i class="fas fa-arrow-down"></i></span>
<span class="btn btn-outline-secondary btn-sm" data-toggle="tooltip" data-placement="top" title="" onclick="stopScroll();" data-original-title="Giảm cuộn trang"><i class="fas fa-arrow-up"></i></span>
</div>
<div class="btn-group mr-1">
<span id="fontsize" class="btn btn-outline-secondary btn-sm" data-toggle="tooltip" data-placement="top" title="" data-original-title="Cỡ chữ"><i class="fas fa-font fa-1x"></i></span>
<a href="https://hopamviet.vn/chord/printsong/suong-roi/W8IUA786.html" target="_blank" class="btn btn-outline-secondary btn-sm" data-toggle="tooltip" data-placement="top" title="" data-original-title="In"><i class="fas fa-print"></i></a>
<span id="clone" class="btn btn-outline-secondary btn-sm" data-toggle="tooltip" data-placement="top" title="" data-original-title="Nhân đôi lời">x2</span>
</div>
</div>
    </>
  )
}

export default ToolBar
