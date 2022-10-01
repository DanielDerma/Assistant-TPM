import * as React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';

BasicBreadcrumbs.propTypes = {
  link: PropTypes.array.isRequired,
};

export default function BasicBreadcrumbs({ link }) {
  return (
    <div role="presentation">
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 5 }}>
        {link.map((item) => (
          <Link component={RouterLink} to={item.href || '#'} key={item} underline="hover" color="text.primary">
            {item.name}
          </Link>
        ))}
      </Breadcrumbs>
    </div>
  );
}
