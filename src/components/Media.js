import { Card, CardActionArea, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import empresa from '../utils/image/empresa.jpg';

const Media = () => {
  const lista = Array.from(Array(3), (_, i) => i + 1);

  return (
    <Grid container spacing={4}>
      {lista.map((item) => (
        <Grid key={item} item xs={12} md={6}>
          <Card>
            <CardActionArea
              component={Link}
              to="/dashboard/manage/tortilleria"
              sx={{
                boxShadow: 0,
                bgcolor: '#f2f2f2',
              }}
            >
              <CardContent>
                <Typography component="h2" variant="h4">
                  Lorem ipsum dolor sit amet.
                </Typography>
                <Typography variant="subtitle2" paragraph>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Magni cum natus, laborum in ipsa illum
                  necessitatibus assumenda cumque, a fugit eos? Fuga dolorem fugiat
                </Typography>
              </CardContent>
              <CardMedia sx={{ maxheight: 100 }} component="img" image={empresa} alt="gato" />
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default Media;
