// import type {Config} from '@docusaurus/types';
// import type * as Preset from '@docusaurus/preset-classic';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const lightCodeTheme = require('prism-react-renderer').themes.github;
const darkCodeTheme = require('prism-react-renderer').themes.dracula;

const config = {
  title: 'Isaac Chung',
  tagline: 'A site about Isaac\'s talk points when he runs out of things to talk about.',
  favicon: 'img/1311.png',

  // Set the production url of your site here
  url: 'https://isaac-chung.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'isaac-chung', // Usually your GitHub org/user name.
  projectName: 'isaac-chung.github.io', // Usually your repo name.
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          remarkPlugins: [
            remarkMath
          ],
          rehypePlugins: [rehypeKatex],
        },
        blog: {
          showReadingTime: true,
          readingTime: ({content, defaultReadingTime}) =>
            defaultReadingTime({content, options: {wordsPerMinute: 300}}),
          feedOptions: {
            type: 'all',
            copyright: `Copyright © ${new Date().getFullYear()} Isaac Chung`,
            createFeedItems: async (params) => {
              const {blogPosts, siteConfig, defaultCreateFeedItems, ...rest} = params;
              return defaultCreateFeedItems({
                // Keep only the 10 most recent blog posts in the feed
                blogPosts: blogPosts.filter((item, index) => index < 20),
                siteConfig,
                outDir: rest.outDir,
              });
            },
          },
          remarkPlugins: [
            remarkMath
          ],
          rehypePlugins: [rehypeKatex],
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        gtag: {
          trackingID: 'G-D4GPBWLTG6',
          anonymizeIP: true,
        },
      },
    ],
  ],
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
      crossorigin: 'anonymous',
    },
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/1311.jpg',
    navbar: {
      title: 'Isaac Chung',
      logo: {
        alt: 'icon',
        src: 'img/1311.png',
      },
      items: [
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/isaac-chung',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
       {
          title: 'Social',
          items: [
            {
              label: 'Twitter',
              href: 'https://twitter.com/isaacchung1217',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/isaac-chung',
            },
          ],
        },
      ],
      // Existing copyright...
      copyright: `Copyright © ${new Date().getFullYear()} Isaac Chung`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
  },
};

export default config;