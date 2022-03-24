import type { VFC } from 'react';
import SEO from './SEO';

const Head: VFC = () => {
  return (
    <SEO>
      <meta
        key='viewport'
        name='viewport'
        content='width=device-width, initial-scale=1'
      />
      <link rel='manifest' href='/manifest.json' />
      <link rel='apple-touch-icon' href='/icon.svg'></link>

      <meta name='application-name' content='Xpost' />
      <meta name='apple-mobile-web-app-capable' content='yes' />
      <meta name='apple-mobile-web-app-status-bar-style' content='default' />
      <meta name='apple-mobile-web-app-title' content='Xpost' />
      <link rel='shortcut icon' href='/images/favicon.ico' />
      <link
        rel='apple-touch-icon'
        sizes='180x180'
        href='/images/apple-touch-icon.png'
      />
      <link
        rel='icon'
        type='image/png'
        sizes='32x32'
        href='/images/favicon-32x32.png'
      />
      <link
        rel='icon'
        type='image/png'
        sizes='16x16'
        href='/images/favicon-16x16.png'
      />
    </SEO>
  );
};

export default Head;
