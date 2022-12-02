import * as React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';

BasicBreadcrumbs.propTypes = {
  utils: PropTypes.object,
  loading: PropTypes.bool,
  error: PropTypes.bool,
  paths: PropTypes.array,
};

export default function BasicBreadcrumbs({ utils, loading, error, paths }) {
  if (loading || error) return null;
  console.log(paths.slice(0, 0 + 1).join('/'));
  return (
    <div role="presentation">
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 5 }}>
        {[...utils.structure, ''].map((item, i) => (
          <Link
            component={RouterLink}
            to={paths.slice(0, i + 1).join('/') || '#'}
            key={item}
            underline="hover"
            color="text.primary"
          >
            {item?.title || ''}
          </Link>
        ))}
      </Breadcrumbs>
    </div>
  );
}
