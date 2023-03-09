interface Env {
  SITE_NAME: string;
  ICON_URL: string;
}

const pad = (num: number) => num.toString().padStart(2, '0');

const wait = async (ms: number) =>
  new Promise(resolve => {
    setTimeout(async () => resolve(true), ms);
  });

const html = ({
  headline,
  description,
  imageUrl,
  iconUrl,
  siteName,
  year,
  month,
  day,
  props,
}: {
  headline: string;
  description: string;
  imageUrl: string;
  iconUrl: string;
  siteName: string;
  year: number;
  month: number;
  day: number;
  props: Object;
}) => {
  const y = pad(year);
  const m = pad(month);
  const d = pad(day);
  const hh = pad((year * month * day) % 24);
  const mm = pad((year * day) % 60);
  const ss = pad((year * month * headline.length) % 60);
  const timestamp = `${y}-${m}-${d}T${hh}:${mm}:${ss}Z`;
  const cleanImageUrl = imageUrl.replace(/http(?s):/, '');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${headline}</title>
        <meta charset="utf-8">
        <meta property="og:title" content="${headline}" />
        <meta property="og:description" content="${description}" />
        <meta name="article:published_time" content="${timestamp}">

        <meta property="og:image" content="${cleanImageUrl}" />
        <meta property="og:type" content="article">
        <meta property="og:site_name" content="${siteName}">
        <meta property="og:locale" content="en_US">

        ${Object.entries(props)
          .map(
            ([k, v], i) => `
              <meta property="twitter:label${i + 1}" content="${k}">
              <meta property="twitter:data${i + 1}" content="${v}">
            `
          )
          .join('')}

        <link rel="shortcut icon" href="${iconUrl}">
      </head>
      <body>
        <div>You must enable Javascript to view this page.</div>
      </body>
    </html>
  `;
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // await wait(5000);

    try {
      const { pathname, searchParams } = new URL(request.url);
      const [_topic, year, month, day, headline, description, imageUrl] =
        pathname.slice(1).split('/');
      const fbshid = searchParams.get('fbshid');

      return new Response(
        html({
          headline: decodeURIComponent(headline),
          description: atob(description),
          imageUrl: atob(imageUrl),
          iconUrl: env.ICON_URL,
          siteName: env.SITE_NAME,
          year: parseInt(year, 10),
          month: parseInt(month, 10),
          day: parseInt(day, 10),
          props: fbshid ? JSON.parse(atob(fbshid)) : {},
        }),
        {
          headers: {
            'Content-type': 'text/html',
          },
        }
      );
    } catch (e) {
      console.log('\n\n', e, '\n\n');
      return new Response('Not found', { status: 404 });
    }
  },
};
