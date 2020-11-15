import React from 'react'
import { Grid } from '@material-ui/core'
import SynthetifyIconHorizontal from '@components/SynthetifyIconHorizontal/SynthetifyIconHorizontal'

import useStyles from './style'
export const Header: React.FC = () => {
  const classes = useStyles()

  return (
    <>
      <Grid container className={classes.root} justify='space-between' alignItems='center'>
        <Grid item>
          <SynthetifyIconHorizontal />
        </Grid>
        <Grid item></Grid>
      </Grid>
    </>
  )
}
export default Header
