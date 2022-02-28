import React from 'react';
import ReactPlayer from 'react-player';

export default function YoutubeEmbed({
  attrs: { href },
}: {
  attrs: { href: string };
}) {
  return <ReactPlayer url={href} />;
}
