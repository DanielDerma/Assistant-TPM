import * as React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';

BasicBreadcrumbs.propTypes = {
  utils: PropTypes.object,
  loading: PropTypes.bool,
  error: PropTypes.bool,
};

export default function BasicBreadcrumbs({ utils, loading, error }) {
  console.log({loading, error});
  if (loading  || error) return null;
  console.log(utils);
  return (
    <div role="presentation">
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 5 }}>
        {[...utils.structure, ''].map((item) => (
          <Link component={RouterLink} to={item?.href || '#'} key={item} underline="hover" color="text.primary">
            {item?.title || ''}
          </Link>
        ))}
      </Breadcrumbs>
    </div>
  );
}
