import React from 'react';
import ReactPlayer from 'react-player';

export default function YoutubeEmbed({ attrs: { href } }: any) {
  return <ReactPlayer url={href} />;
}
