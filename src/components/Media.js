import { Card, CardActionArea, CardContent, CardMedia, Grid, Skeleton, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getRoutes } from '../utils';

const Media = ({ data, loading, step, hrefs }) => {
  if (loading) {
    return (
      <Grid container spacing={4}>
        {[1, 2].map((elem) => (
          <Grid key={elem} item xs={12} md={6}>
            <Card>
              <CardActionArea
                sx={{
                  boxShadow: 0,
                  bgcolor: '#f2f2f2',
                }}
              >
                <CardContent>
                  <Typography component="h2" variant="h4">
                    <Skeleton variant="text" />
                  </Typography>
                  <Typography variant="subtitle2" paragraph>
                    <Skeleton variant="text" />
                  </Typography>
                </CardContent>
                <Skeleton variant="rectangular" width="100%" height={200} />
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }
  return (
    <Grid container spacing={4}>
      {data.map(({ id, title, description, image }) => (
        <Grid key={id} item xs={12} md={6}>
          <Card>
            <CardActionArea
              component={Link}
              to={hrefs ? getRoutes(step, { ...hrefs, id }) : ''}
              sx={{
                boxShadow: 0,
                bgcolor: '#f2f2f2',
              }}
            >
              <CardContent>
                <Typography component="h2" variant="h4">
                  {title}
                </Typography>
                <Typography variant="subtitle2" paragraph>
                  {description}
                </Typography>
              </CardContent>
              <CardMedia sx={{ height: 350, objectFit: 'cover' }} component="img" src={image} alt={title} />
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

Media.propTypes = {
  data: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  step: PropTypes.string,
  hrefs: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
};

export default Media;
