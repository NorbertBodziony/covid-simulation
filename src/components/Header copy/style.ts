import { makeStyles } from '@material-ui/core/styles'
import { colors } from '@static/theme'
const useStyles = makeStyles(() => ({
  root: {
    height: 110,
    paddingLeft: '2%',
    paddingRight: '2%'
  },
  logo: {
    height: 36,
    marginTop: 6,
    cursor: 'pointer'
  },
  divButton: {
    marginLeft: 70
  },
  actionItem: {
    color: colors.white.main,
    fontSize: '16px',
    paddingLeft: 28,
    '&:hover': {
      color: colors.green.main
    }
  },
  button: {
    width: 'auto'
  }
}))

export default useStyles
