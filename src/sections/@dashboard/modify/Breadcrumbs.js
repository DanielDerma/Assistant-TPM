import * as React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';

function handleClick(event) {
  event.preventDefault();
  console.info('You clicked a breadcrumb.');
}

BasicBreadcrumbs.propTypes = {
  link: PropTypes.array.isRequired,
};

export default function BasicBreadcrumbs({ link }) {
  return (
    <div role="presentation" onClick={handleClick}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 5 }}>
        {link.map((item) => (
          <Link key={item} underline="hover" color="text.primary" href={item.href || '#'}>
            {item.name}
          </Link>
        ))}
      </Breadcrumbs>
    </div>
  );
}
