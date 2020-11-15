import React from 'react'
import { hot } from 'react-hot-loader/root'
import { Provider } from 'react-redux'
import { ThemeProvider } from '@material-ui/core'

import { store } from './store'
import { theme } from './static/theme'

import WelcomePage from '@containers/WelcomePage/WelcomePage'
import { SnackbarProvider } from 'notistack'

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider maxSnack={99}>
          <WelcomePage />
        </SnackbarProvider>
      </ThemeProvider>
    </Provider>
  )
}
export default process.env.NODE_ENV === 'development' ? hot(App) : App
