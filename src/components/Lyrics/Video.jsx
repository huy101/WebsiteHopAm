import React from 'react';

const Video = ({ videoId }) => {
  const videoUrl = `https://www.youtube.com/embed/${videoId}`;
  return (
    <div>
      <iframe
        width="327"
        height="181"
        src={videoUrl}
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="YouTube video"
      />
    </div>
  );
};

export default Video;
