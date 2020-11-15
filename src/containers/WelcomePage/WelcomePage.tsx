import React from 'react'
import Grid from '@material-ui/core/Grid'
import useStyles from './style'
import Header from '@components/Header/Header'

const WelcomePage: React.FC = () => {
  const classes = useStyles()

  return (
    <Grid container direction='column' className={classes.background}>
      <Grid item className={classes.spacing40}>
        <Header></Header>
      </Grid>
    </Grid>
  )
}

export default WelcomePage
