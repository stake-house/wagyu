import { Grid, Typography } from '@mui/material';
import React from "react";
import styled from '@emotion/styled';

declare var VERSION: string;
declare var COMMITHASH: string;

const SoftText = styled(Typography)`
  color: gray;
  text-align: center;
  font-size: 10px;
`;

const Container = styled.div`
  position: fixed;
  bottom: 15;
  width: 100%;
`;

/**
 * This component is a footer used to display the version and commit hash.
 * 
 * @returns the footer component containing the version and commit hash
 */
const VersionFooter = () => {
  return (
    <Container>
      <Grid container direction="column">
        <Grid item xs={12}>
          <SoftText>Version: {VERSION} - Commit Hash: {COMMITHASH}</SoftText>
        </Grid>
      </Grid>
    </Container>
  )
}

export default VersionFooter;