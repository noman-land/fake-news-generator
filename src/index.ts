const html = ({
  headline,
  description,
  imageUrl,
  iconUrl,
  siteName,
  date,
}: {
  headline: string;
  description: string;
  imageUrl: string;
  iconUrl: string;
  siteName: string;
  date: string;
}) => `
  <!DOCTYPE html>
  <html>
    <head>
      <title>${headline}</title>
      <meta charset="utf-8">
      <meta property="og:title" content="${headline}" />
      <meta property="og:description" content="${description}" />

      <meta property="twitter:label1" content="Published">
      <meta property="twitter:data1" content="${date}">
      <meta property="twitter:label2" content="Reading time">
      <meta property="twitter:data2" content="6 minutes">

      <meta property="og:image" content="${imageUrl}" />
      <meta property="og:type" content="article">
      <meta property="og:site_name" content="${siteName}">
      <meta property="og:locale" content="en_US">

      <link rel="shortcut icon" href="${iconUrl}">
    </head>
    <body>
      <div>You must enable Javascript to view this page.</div>
    </body>
  </html>
`;

export default {
  async fetch(request: Request): Promise<Response> {
    try {
      const { pathname, searchParams } = new URL(request.url);
      const { v: iconUrl } = Object.fromEntries(
        new URLSearchParams(searchParams).entries()
      );
      const [, year, month, day, siteName, headline, description, imageUrl] =
        pathname.split('/');

      return new Response(
        html({
          headline: decodeURIComponent(headline),
          description: decodeURIComponent(description),
          siteName: decodeURIComponent(siteName),
          imageUrl: atob(imageUrl),
          iconUrl: atob(iconUrl),
          date: new Date(`${year}-${month}-${day}`)
            .toUTCString()
            .replace('00:00:00 GMT', '8:42 AM'),
        }),
        {
          headers: {
            'Content-type': 'text/html',
          },
        }
      );
    } catch (e) {
      return new Response('Not found', { status: 404 });
    }
  },
};
