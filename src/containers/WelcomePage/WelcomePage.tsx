/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
import React, { useEffect, useRef, useState } from 'react'
import Grid from '@material-ui/core/Grid'
import Slider from '@material-ui/core/Slider'
import useStyles from './style'
import { Typography } from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import { Chart, PieSeries, Legend } from '@devexpress/dx-react-chart-material-ui'
import { Animation } from '@devexpress/dx-react-chart'

enum State {
  DEAD,
  INFECTED,
  HEALTHY
}
interface Dot {
  x: number
  y: number
  radius: number
  xMove: 0 | 1
  yMove: 0 | 1
  state: State
  inmune: boolean
}
const CHANCE_OF_INFECTION = 0.1
const DISTANCE_FOR_INFECTION = 3
const CHANCE_TO_SURVIVE = 0.95
const dots: Dot[] = Array.from(Array(1000)).map((_, i) => {
  return {
    x: Math.random() * 600,
    y: Math.random() * 600,
    radius: 3,
    xMove: i % 2,
    yMove: i % 2,
    // state: i % 500 === 0 ? State.INFECTED : State.HEALTHY,
    state: State.HEALTHY,
    inmune: false
  } as Dot
})
const moveDot = (ctx: CanvasRenderingContext2D, dot: Dot, speed: number) => {
  if (dot.state === State.DEAD) {
    return
  }
  // Random infect
  if (Math.random() > 0.9999 && !dot.inmune) {
    dot.state = State.INFECTED
  }
  if (dot.xMove === 1) {
    dot.x += speed
  } else {
    dot.x -= speed
  }
  if (dot.yMove === 1) {
    dot.y += speed
  } else {
    dot.y -= speed
  }
  drawDot(ctx, dot)
  if (dot.state === State.INFECTED) {
    dots.forEach((d, index) => {
      if (dots[index].inmune) {
        return
      }
      const distance = Math.sqrt((d.x - dot.x) ** 2 + (d.y - dot.y) ** 2)
      if (distance < DISTANCE_FOR_INFECTION && distance !== 0) {
        if (Math.random() < CHANCE_OF_INFECTION) {
          dots[index].state = State.INFECTED
          setTimeout(() => {
            if (Math.random() > CHANCE_TO_SURVIVE) {
              dots[index].state = State.DEAD
            } else {
              dots[index].state = State.HEALTHY
              dots[index].inmune = true
            }
          }, 3000)
        }
      }
    })
  }
  if (dot.x + dot.radius > ctx.canvas.width) {
    dot.xMove = 0
  }
  if (dot.x - dot.radius < 0) {
    dot.xMove = 1
  }
  if (dot.y + dot.radius > ctx.canvas.height) {
    dot.yMove = 0
  }
  if (dot.y - dot.radius < 0) {
    dot.yMove = 1
  }
}
const draw = (ctx: CanvasRenderingContext2D, frameCount: number, speed: number) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  ctx.fillStyle = '#000000'
  dots.forEach(dot => {
    moveDot(ctx, dot, speed)
  })
}
function drawDot(ctx: CanvasRenderingContext2D, dot: Dot) {
  ctx.beginPath()
  ctx.arc(dot.x, dot.y, dot.radius, 0, 2 * Math.PI, false)
  ctx.fillStyle = dot.state === State.HEALTHY ? 'green' : 'red'
  ctx.fill()
}
const WelcomePage: React.FC = () => {
  const classes = useStyles()
  const [speed, setSpeed] = useState(1)
  const [temp, forceUpdate] = useState(1)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    let frameCount = 0
    let animationFrameId = 0

    if (canvasRef?.current !== null) {
      const context = canvasRef.current.getContext('2d')
      if (context) {
        const render = () => {
          frameCount++
          draw(context, frameCount, speed)
          animationFrameId = window.requestAnimationFrame(render)
        }
        render()
        return () => {
          window.cancelAnimationFrame(animationFrameId)
        }
      }
    }
  }, [draw, speed])
  useEffect(() => {
    setTimeout(() => {
      forceUpdate(temp + 1)
    }, 1000)
  }, [temp])
  return (
    <Grid container className={classes.background} justify='center' spacing={4}>
      <Grid item xs={12} className={classes.header}>
        <Typography color='textPrimary' variant='h2'>
          Covid-19 simulation
        </Typography>
      </Grid>
      <Grid item>
        <Typography color='textPrimary' gutterBottom>
          Simulation speed
        </Typography>
        <Slider
          style={{ width: 200 }}
          defaultValue={1}
          onChange={(_, value) => {
            setSpeed(value as number)
          }}
          aria-labelledby='discrete-slider'
          valueLabelDisplay='auto'
          step={1}
          marks
          min={1}
          max={10}
        />
        <Paper style={{ backgroundColor: 'inherit' }}>
          <Chart
            width={400}
            data={dots.reduce(
              (acc, curr) => {
                if (curr.state === State.HEALTHY) {
                  if (curr.inmune) {
                    acc[3].count += 1
                  } else {
                    acc[2].count += 1
                  }
                }
                if (curr.state === State.INFECTED) {
                  acc[0].count += 1
                }
                if (curr.state === State.DEAD) {
                  acc[1].count += 1
                }
                return acc
              },
              [
                { name: 'infected', count: 20 },
                { name: 'dead', count: 10 },
                { name: 'healthy', count: 0 },
                { name: 'inmune', count: 0 }
              ]
            )}>
            <PieSeries valueField='count' argumentField='name' />
            <Legend position='top'></Legend>
            <Animation />
          </Chart>
        </Paper>
      </Grid>
      <Grid item>
        <canvas ref={canvasRef} className={classes.dots} width={700} height={700} id='canv'>
          Your browser does not support canvas.
        </canvas>
      </Grid>
    </Grid>
  )
}

export default WelcomePage
