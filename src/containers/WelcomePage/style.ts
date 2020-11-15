import { makeStyles, createStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() =>
  createStyles({
    background: {
      minHeight: '100vh',
      minWidth: '100%',
      position: 'relative',
      background: '#030313',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    },

    dots: {
      backgroundColor: 'white',
      borderRadius: 15
      // width: 600,
      // height: 600
    },
    header: { margin: 20 }
  })
)
export default useStyles
