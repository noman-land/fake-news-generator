export interface Env {}

const html = ({
  headline,
  description,
  imageUrl,
  siteName,
  year,
  month,
  day,
}: {
  headline: string;
  description: string;
  imageUrl: string;
  siteName: string;
  year: string;
  month: string;
  day: string;
}) => `
	<!DOCTYPE html>
	<html>
		<head>
			<title>${headline}</title>
			<meta charset="utf-8">
			<meta property="og:title" content="${headline}" />
			<meta property="og:description" content="${description}" />

			<meta property="twitter:label1" content="Published">
			<meta property="twitter:data1" content="${year}-${month}-${day} 7:52am">
			<meta property="twitter:label2" content="Reading time">
			<meta property="twitter:data2" content="6 minutes">

			<meta property="og:image" content="${imageUrl}" />
			<meta property="og:type" content="article">
			<meta property="og:site_name" content="${siteName}">
			<meta property="og:locale" content="en_US">

			<link rel="shortcut icon" href="./icon.png">
		</head>
		<body style="height: 100%; display: flex;">
			<h1 style="margin: auto;">Fake news is easy now.</h1>
		</body>
	</html>
`;

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    try {
      const [, year, month, day, siteName, headline, description, imageUrl] =
        new URL(request.url).pathname.split('/');

      return new Response(
        html({
          headline,
          description,
          siteName,
          imageUrl: atob(imageUrl),
          year,
          month,
          day,
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
