import { Typography } from '@mui/material';
import { Container } from '@mui/system';
import React from 'react';
import { useParams } from 'react-router-dom';
import Page from '../components/Page';
import Breadcrumbs from '../components/Breadcrumbs';

const Modify = () => {
  const { location, area, workspace, system } = useParams();
  return (
    <Page name="Modificar">
      <Container maxWidth="xl">
        <Typography variant="h3" sx={{ mb: 4 }}>
          {system}
        </Typography>
        <Breadcrumbs
          link={[
            { name: 'Gestionar', href: '/dashboard/manage/locations' },
            { name: location, href: `/dashboard/manage/${location}` },
            { name: area, href: `/dashboard/manage/${location}/${area}` },
            { name: workspace, href: `/dashboard/manage/${location}/${area}/${workspace}` },
            { name: system, href: `/dashboard/manage/${location}/${area}/${workspace}/${system}` },
          ]}
        />
        <Typography variant="subtitle2" sx={{ mb: 4 }}>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vitae laborum quo recusandae ducimus molestiae eius
          reiciendis, ad quam iusto voluptatem possimus, neque velit non ab enim rem esse maiores! Fugiat consectetur
          obcaecati quidem consequatur officia tenetur cum ex corporis reiciendis, quibusdam id, harum a eligendi. Enim
          cupiditate vitae sit laboriosam molestias nulla esse incidunt earum blanditiis quis modi fugit facilis, quasi
          architecto eius et impedit hic provident! Consectetur ex ut quam animi repellendus omnis quas soluta adipisci
          quidem recusandae quia in quos optio porro accusantium officiis, architecto minus eaque? Sed temporibus quas
          ea aperiam harum dicta unde odit quia sapiente? Veritatis porro cumque nostrum illo nemo culpa optio omnis
          nesciunt ad, sapiente molestiae ducimus harum eius quos velit quo est? Aperiam tenetur culpa laudantium
          consectetur quis atque voluptate ex, aliquam deserunt aspernatur, cupiditate quaerat repudiandae labore ab.
          Fugiat soluta alias quibusdam fugit reprehenderit eligendi repellendus dolorum odio illum beatae ab ad, quam
          nisi expedita vero porro non quo laboriosam omnis odit numquam adipisci, quisquam, dolor sapiente? Iusto sunt,
          pariatur voluptate velit sequi dolorem iste quas explicabo cupiditate illo facere suscipit quod placeat qui
          eius eaque laudantium! Autem natus obcaecati illo exercitationem necessitatibus dignissimos laborum mollitia
          quidem veniam. Deserunt modi quia accusantium labore? Ullam excepturi saepe rem consequatur dolorem in error
          vero, recusandae placeat quos fugiat voluptates. Ipsam ipsum sunt neque assumenda expedita eaque recusandae
          sapiente voluptatem. Cum ea dolores repellendus vel unde porro natus architecto officiis consequatur. Autem
          aperiam aliquam, quo quod delectus doloribus doloremque provident consequuntur veritatis, hic aliquid.
        </Typography>
      </Container>
    </Page>
  );
};

export default Modify;
