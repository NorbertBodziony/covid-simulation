import React from 'react'
import { storiesOf } from '@storybook/react'
import Header from './Header'
import { withKnobs } from '@storybook/addon-knobs'

storiesOf('Containers/Header', module)
  .addDecorator(withKnobs)
  .add('default', () => <Header />)
