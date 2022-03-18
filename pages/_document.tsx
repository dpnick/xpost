import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';

class MainDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel='manifest' href='/manifest.json' />
          <link rel='apple-touch-icon' href='/icon.svg'></link>

          <meta name='application-name' content='Xpost' />
          <meta name='apple-mobile-web-app-capable' content='yes' />
          <meta
            name='apple-mobile-web-app-status-bar-style'
            content='default'
          />
          <meta name='apple-mobile-web-app-title' content='Xpost' />
          <meta
            name='description'
            content='Productivity tool for content creator'
          />
          <meta name='mobile-web-app-capable' content='yes' />

          <meta name='twitter:card' content='summary' />
          <meta name='twitter:url' content='https://xpost.netlify.app' />
          <meta name='twitter:title' content='Xpost' />
          <meta
            name='twitter:description'
            content='Productivity tool for content creator'
          />
          <meta
            name='twitter:image'
            content='https://xpost.netlify.app/icon/icon-192x192.png'
          />
          <meta name='twitter:creator' content='@dpnick_' />

          <meta property='og:type' content='website' />
          <meta property='og:title' content='Xpost' />
          <meta
            property='og:description'
            content='Productivity tool for content creator'
          />
          <meta property='og:site_name' content='Xpost' />
          <meta property='og:url' content='https://xpost.netlify.app' />
          <meta
            property='og:image'
            content='https://xpost.netlify.app/images/apple-touch-icon.png'
          />
        </Head>
        <body>
          <Main />
          <NextScript />
          <div id='modal-root'></div>
        </body>
      </Html>
    );
  }
}

export default MainDocument;
