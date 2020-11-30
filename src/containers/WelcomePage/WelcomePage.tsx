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
import * as R from 'remeda'
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
const dots: Dot[] = Array.from(Array(300)).map((_, i) => {
  return {
    x: Math.random() * 700,
    y: Math.random() * 700,
    radius: 3,
    xMove: Math.random() > 0.5 ? 1 : 0,
    yMove: Math.random() > 0.5 ? 1 : 0,
    // state: i % 500 === 0 ? State.INFECTED : State.HEALTHY,
    state: State.HEALTHY,
    inmune: false
  } as Dot
})
const moveDot = (ctx: CanvasRenderingContext2D, dot: Dot, variables: IVariables) => {
  if (dot.state === State.DEAD) {
    return
  }
  // Random infect
  if (Math.random() > 0.9999 && !dot.inmune) {
    dot.state = State.INFECTED
  }
  if (dot.xMove === 1) {
    dot.x += variables.speed
  } else {
    dot.x -= variables.speed
  }
  if (dot.yMove === 1) {
    dot.y += variables.speed
  } else {
    dot.y -= variables.speed
  }
  drawDot(ctx, dot)
  if (dot.state === State.INFECTED) {
    dots.forEach((d, index) => {
      if (dots[index].inmune) {
        return
      }
      const distance = Math.sqrt((d.x - dot.x) ** 2 + (d.y - dot.y) ** 2)
      if (distance < variables.distanceForInfection && distance !== 0) {
        if (Math.random() < variables.chanceOfInfection / 100) {
          dots[index].state = State.INFECTED
          setTimeout(() => {
            if (Math.random() > variables.chanceToSurvive / 100) {
              dots[index].state = State.DEAD
            } else {
              dots[index].state = State.HEALTHY
              dots[index].inmune = true
            }
          }, 3000 + Math.random() * 10000)
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
interface IVariables {
  speed: number
  chanceOfInfection: number
  distanceForInfection: number
  chanceToSurvive: number
}
const draw = (ctx: CanvasRenderingContext2D, frameCount: number, variables: IVariables) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  ctx.fillStyle = '#000000'
  dots.forEach(dot => {
    moveDot(ctx, dot, variables)
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
  const [chanceOfInfection, setChanceOfInfection] = useState(30)
  const [distanceForInfection, setDistanceForInfection] = useState(10)
  const [chanceToSurvive, setChanceToSurvive] = useState(95)
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
          draw(context, frameCount, {
            speed,
            chanceOfInfection,
            distanceForInfection,
            chanceToSurvive
          })

          animationFrameId = window.requestAnimationFrame(render)
        }
        render()
        return () => {
          window.cancelAnimationFrame(animationFrameId)
        }
      }
    }
  }, [draw, speed, chanceOfInfection, distanceForInfection, chanceToSurvive])
  useEffect(() => {
    setTimeout(() => {
      forceUpdate(temp + 1)
    }, 2000)
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
        <Typography color='textPrimary' gutterBottom>
          Chance for infection
        </Typography>
        <Slider
          style={{ width: 200 }}
          defaultValue={30}
          onChange={(_, value) => {
            setChanceOfInfection(value as number)
          }}
          aria-labelledby='discrete-slider'
          valueLabelDisplay='auto'
          step={1}
          marks
          min={0}
          max={100}
        />
        <Typography color='textPrimary' gutterBottom>
          Distance for infection
        </Typography>
        <Slider
          style={{ width: 200 }}
          defaultValue={10}
          onChange={(_, value) => {
            setDistanceForInfection(value as number)
          }}
          aria-labelledby='discrete-slider'
          valueLabelDisplay='auto'
          step={1}
          marks
          min={1}
          max={100}
        />
        <Typography color='textPrimary' gutterBottom>
          Chance to survive
        </Typography>
        <Slider
          style={{ width: 200 }}
          defaultValue={95}
          onChange={(_, value) => {
            setChanceToSurvive(value as number)
          }}
          aria-labelledby='discrete-slider'
          valueLabelDisplay='auto'
          step={1}
          marks
          min={1}
          max={100}
        />
        <Paper style={{ backgroundColor: 'inherit' }}>
          <Chart
            width={400}
            data={dots
              .reduce(
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
                  { name: 'infected', count: 0 },
                  { name: 'dead', count: 0 },
                  { name: 'healthy', count: 0 },
                  { name: 'inmune', count: 0 }
                ]
              )
              .map(v => {
                return { name: `${v.name} ${v.count}`, count: v.count }
              })}>
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
