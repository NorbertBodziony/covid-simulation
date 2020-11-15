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
    contentContainer: {
      width: '100%'
    },
    contentWrapper: {
      maxWidth: 1360
    },
    spacing40: {
      marginTop: 40
    }
  })
)
export default useStyles
