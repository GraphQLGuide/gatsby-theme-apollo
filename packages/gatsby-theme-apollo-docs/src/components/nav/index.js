import NavItem from './nav-item';
import PropTypes from 'prop-types';
import React from 'react';
import styled from '@emotion/styled';
import {breakpoints} from 'gatsby-theme-apollo';

const Container = styled.nav({
  display: 'flex',
  alignSelf: 'stretch',
  marginLeft: 'auto',
  paddingLeft: 40,
  [breakpoints.sm]: {
    display: 'none'
  }
});

const navConfig = {
  '/docs': {
    text: 'Platform',
    matchRegex: /^\/docs\/(intro|platform|resources|references|$)/
  },
  '/docs/tutorial/introduction': {
    text: 'Tutorial',
    matchRegex: /^\/docs\/tutorial/
  },
  '/docs/react': {
    text: 'Client',
    subpages: {
      '/docs/react': 'React + React Native',
      '/docs/angular': 'Angular',
      'https://github.com/akryum/vue-apollo': 'Vue.js',
      '/docs/link': 'Apollo Link',
      '/docs/ios': 'Native iOS',
      '/docs/android': 'Native Android',
      '/docs/scalajs': 'Scala.js'
    }
  },
  '/docs/apollo-server': {
    text: 'Server',
    subpages: {
      '/docs/apollo-server': 'Apollo Server',
      '/docs/graphql-tools': 'graphql-tools',
      '/docs/graphql-tools/schema-stitching': 'Schema stitching',
      '/docs/graphql-subscriptions': 'GraphQL subscriptions'
    }
  },
  '/docs/community': {
    text: 'Community',
    subpages: {
      'https://blog.apollographql.com': 'Blog',
      'https://spectrum.chat/apollo': 'Spectrum',
      'https://twitter.com/apollographql': 'Twitter',
      'https://youtube.com/channel/UC0pEW_GOrMJ23l8QcrGdKSw': 'YouTube',
      '/docs/community': 'Contribute',
      'https://summit.graphql.com': 'GraphQL Summit',
      'https://graphql.com': 'Explore GraphQL'
    }
  }
};

function generateSubpage([value, text]) {
  return {
    value,
    text
  };
}

function generateNavItems(config) {
  return Object.entries(config).map(
    ([value, {text, matchRegex, subpages}]) => ({
      value,
      text,
      matchRegex,
      subpages: subpages && Object.entries(subpages).map(generateSubpage)
    })
  );
}

export const navItems = generateNavItems(navConfig);
export default function Nav(props) {
  return (
    <Container>
      {navItems.map(({value, text, matchRegex, subpages}) => {
        let isActive = matchRegex
          ? matchRegex.test(props.pathname)
          : props.isPathActive(value);
        if (!isActive && subpages) {
          isActive = subpages.some(subpage =>
            props.isPathActive(subpage.value)
          );
        }

        return (
          <NavItem
            key={value}
            href={value}
            subpages={subpages}
            active={isActive}
          >
            {text}
          </NavItem>
        );
      })}
    </Container>
  );
}

Nav.propTypes = {
  pathname: PropTypes.string.isRequired,
  isPathActive: PropTypes.func.isRequired
};
