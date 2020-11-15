/* eslint-disable @typescript-eslint/consistent-type-assertions */
import React, { useEffect, useRef, useState } from 'react'
import Grid from '@material-ui/core/Grid'
import Slider from '@material-ui/core/Slider'
import useStyles from './style'
import Header from '@components/Header/Header'
import { Typography } from '@material-ui/core'
interface Dot {
  x: number
  y: number
  radius: number
  xMove: 0 | 1
  yMove: 0 | 1
  color: 'red' | 'blue' | 'green'
}

const dots: Dot[] = Array.from(Array(2000)).map((_, i) => {
  return {
    x: Math.random() * 600,
    y: Math.random() * 600,
    radius: 3,
    xMove: i % 2,
    yMove: i % 2,
    color: i % 3 === 2 ? 'blue' : i % 3 === 1 ? 'red' : 'green'
  } as Dot
})
console.log(dots.length)
const moveDot = (ctx: CanvasRenderingContext2D, dot: Dot, speed: number) => {
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
  ctx.fillStyle = dot.color
  ctx.fill()
}
const WelcomePage: React.FC = () => {
  const classes = useStyles()
  const [speed, setSpeed] = useState(1)
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

  return (
    <Grid container direction='column' className={classes.background} alignItems='center'>
      <Grid item className={classes.spacing40}>
        <Header></Header>
      </Grid>
      <Grid item className={classes.spacing40}>
        <canvas ref={canvasRef} className={classes.dots} width={600} height={600} id='canv'>
          Your browser does not support canvas.
        </canvas>
      </Grid>
      <Grid item className={classes.spacing40}>
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
      </Grid>
    </Grid>
  )
}

export default WelcomePage
