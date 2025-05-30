import { Defuddle } from 'defuddle/node';
import { convert } from 'html-to-text';
import { json } from '@tanstack/react-start';
import { setResponseStatus } from '@tanstack/react-start/server';
import { createAPIFileRoute } from '@tanstack/react-start/api';
import { JSDOM } from 'jsdom';

const convertOptions = {
  formatters: {
    skipCodeTags: () => ({}),
  },
  selectors: [
    {
      selector: 'a',
      options: { ignoreHref: true },
    },
    { selector: 'img', format: 'skip' },
    { selector: 'code', format: 'skipCodeTags' },
  ],
};

export const APIRoute = createAPIFileRoute('/api/article')({
  GET: async ({ request, params }) => {
    try {
      const requestUrl = new URL(request.url);
      const targetUrl = new URL(requestUrl.searchParams.get('url') || '');
      // Get document HTML
      const dom = await JSDOM.fromURL(targetUrl.toString());
      // Clean up HTML
      const { content, title } = await Defuddle(dom);
      // Get content as readable text
      const text = convert(content, convertOptions);
      const parsedText = text.replace(/\n/g, ' ')
      const textWithTitle = `Title: ${title}. Article: ${parsedText}.`;
      console.log(textWithTitle)
      setResponseStatus(200);
      return json(textWithTitle);
    } catch (error) {
      console.error(error);
      setResponseStatus(500);
      return json({ error: error.message });
    }
  },
});
