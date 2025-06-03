import { Defuddle } from 'defuddle/node';
import { convert } from 'html-to-text';
import { json } from '@tanstack/react-start';
import { setResponseStatus } from '@tanstack/react-start/server';
import { createAPIFileRoute } from '@tanstack/react-start/api';
import { JSDOM } from 'jsdom';

const convertOptions = {
  selectors: [
    {
      selector: 'a',
      options: { ignoreHref: true },
    },
    { selector: 'img', format: 'skip' },
  ],
};

export const APIRoute = createAPIFileRoute('/api/article')({
  GET: async ({ request, params }) => {
    try {
      const requestUrl = new URL(request.url);
      const articleUrl = new URL(requestUrl.searchParams.get('url') || '');
      // Get document HTML
      const dom = await JSDOM.fromURL(articleUrl.toString());
      // DOM Cleaning:
      // - Remove <pre>
      //            <code>...</code>
      //          </pre>
      dom.window.document
        .querySelectorAll('pre code')
        .forEach((e: HTMLElement) => e.remove());
      // Extract main content
      const { content, title } = await Defuddle(dom);
      // Get content as readable text
      const text = convert(content, convertOptions);
      // Remove all new line characters '\n'
      const parsedText = text.replace(/\n/g, ' ');
      const textWithTitle = `Title: ${title}. Article: ${parsedText}.`;
      setResponseStatus(200);
      return json({ text: textWithTitle });
    } catch (error) {
      console.error(error);
      setResponseStatus(500);
      return json({ error: error.message });
    }
  },
});
