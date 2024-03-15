import * as React from 'react';
import Typography from '@mui/material/Typography';
import { Card, CardContent, CardHeader, Grid } from '@mui/material';

export default function Home() {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: '100dvh' }}
    >
      <Grid item xs={3}>
        <Card elevation={3} sx={{ width: 300, minHeight: 150 }}>
          <CardHeader title="Log In" />
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              This page contains a chat powered by <br />Next.js/React, SignalR, Orleans and CosmosDB
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}