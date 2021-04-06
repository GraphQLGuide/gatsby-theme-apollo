const path = require('path');
const remarkTypescript = require('remark-typescript');
const {colors} = require('gatsby-theme-guide-core/src/utils/colors');
const {HEADER_HEIGHT} = require('./src/utils');

module.exports = ({
  root,
  siteName,
  pageTitle,
  description,
  githubHost = 'github.com',
  githubRepo,
  baseDir = '',
  contentDir = 'content',
  versions = {},
  gaTrackingId,
  ignore,
  checkLinksOptions,
  gatsbyRemarkPlugins = [],
  remarkPlugins = []
}) => {
  const allGatsbyRemarkPlugins = [
    {
      // doesn't work when placed last in plugin order
      resolve: require.resolve('./plugins/gatsby-remark-rewrite-urls'),
    },
    {
      resolve: 'gatsby-remark-autolink-headers',
      options: {
        offsetY: HEADER_HEIGHT
      }
    },
    {
      resolve: 'gatsby-remark-copy-linked-files',
      options: {
        ignoreFileExtensions: []
      }
    },
    {
      resolve: 'gatsby-remark-mermaid',
      options: {
        mermaidOptions: {
          themeCSS: `
            .node rect,
            .node circle,
            .node polygon,
            .node path {
              stroke-width: 2px;
              stroke: ${colors.primary};
              fill: ${colors.background};
            }
            .node.secondary rect,
            .node.secondary circle,
            .node.secondary polygon,
            .node.tertiary rect,
            .node.tertiary circle,
            .node.tertiary polygon {
              fill: white;
            }
            .node.secondary rect,
            .node.secondary circle,
            .node.secondary polygon {
              stroke: ${colors.secondary};
            }
            .cluster rect,
            .node.tertiary rect,
            .node.tertiary circle,
            .node.tertiary polygon {
              stroke: ${colors.tertiaryLight};
            }
            .cluster rect {
              fill: none;
              stroke-width: 2px;
            }
            .label, .edgeLabel {
              background-color: white;
              line-height: 1.3;
            }
            .edgeLabel rect {
              background: none;
              fill: none;
            }
            .messageText, .noteText, .loopText {
              font-size: 12px;
              stroke: none;
            }
            g rect, polygon.labelBox {
              stroke-width: 2px;
            }
            g rect.actor {
              stroke: ${colors.tertiary};
              fill: white;
            }
            g rect.note {
              stroke: ${colors.secondary};
              fill: white;
            }
            g line.loopLine, polygon.labelBox {
              stroke: ${colors.primary};
              fill: white;
            }
          `
        }
      }
    },
    'gatsby-remark-code-titles',
    {
      resolve: 'gatsby-remark-prismjs',
      // https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-remark-prismjs#how-to-use
      options: {
        showLineNumbers: true,
        aliases: { 
          sh: "bash",
          gql: "graphql"
        }
      }
    },
    'gatsby-remark-rewrite-relative-links',
    // {
    //   resolve: 'gatsby-remark-check-links',
    //   options: checkLinksOptions
    // },
    ...gatsbyRemarkPlugins
  ];

  const plugins = [
    'gatsby-theme-guide-core',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: path.join(root, contentDir),
        name: 'docs',
        ignore
      }
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: allGatsbyRemarkPlugins
      }
    },
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        gatsbyRemarkPlugins: allGatsbyRemarkPlugins,
        remarkPlugins: [
          [remarkTypescript, {wrapperComponent: 'MultiCodeBlock'}],
          ...remarkPlugins
        ],
        extensions: [`.mdx`, `.md`]
      }
    },
    ...Object.entries(versions).map(([name, branch]) => ({
      resolve: 'gatsby-source-git',
      options: {
        name,
        branch,
        remote: `https://${githubHost}/${githubRepo}`,
        patterns: [
          path.join(baseDir, contentDir, '**'),
          path.join(baseDir, 'gatsby-config.js'),
          path.join(baseDir, '_config.yml')
        ]
      }
    }))
  ];

  if (gaTrackingId) {
    plugins.push({
      resolve: 'gatsby-plugin-google-gtag',
      options: {
        trackingIds: Array.isArray(gaTrackingId) ? gaTrackingId : [gaTrackingId]
      }
    });
  }

  return {
    siteMetadata: {
      title: pageTitle || siteName,
      siteName,
      description
    },
    plugins
  };
};
