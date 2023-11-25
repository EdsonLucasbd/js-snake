const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const eatingEffect = new Audio("../assets/eat_effect.mp3")
const score = document.getElementById('score-value')
const startButton = document.getElementById('start')
const gameOverContainer = document.getElementById('game-over')
const GRID_SIZE = 20
const snake = [{x: 300, y: 420}, {x: 300, y: 400}]
let direction, interval

const food = {
  x: randomPosition(),
  y: randomPosition(),
  color: '#E99287'
}

function randomNumber(max, min) {
  return Math.round(Math.random() * (max - min) + min)
}

function randomPosition() {
  const number = randomNumber(0, canvas.width - GRID_SIZE)
  return Math.round(number / 20) * 20
}

const drawGrid = () => {
  ctx.lineWidth = 1
  ctx.strokeStyle = '#1E2D3D'

  for (let i = GRID_SIZE; i < canvas.width; i += GRID_SIZE) {
    ctx.beginPath()
    ctx.lineTo(i, 0)
    ctx.lineTo(i, canvas.height)
    ctx.stroke()
  }

  for (let i = GRID_SIZE; i < canvas.height; i += GRID_SIZE) {
    ctx.beginPath()
    ctx.lineTo(0, i)
    ctx.lineTo(canvas.height, i)
    ctx.stroke()
  }
}

const drawFood = () => {
  const { x, y, color } = food

    ctx.shadowColor = color
    ctx.shadowBlur = 7
    ctx.fillStyle = color
    ctx.fillRect(x, y, GRID_SIZE, GRID_SIZE)
    ctx.shadowBlur = 0
}

const drawSnake = () => {
  ctx.fillStyle = '#43D9AD'

  snake.forEach((position, index) => {
    if (index === snake.length - 1) {
      ctx.fillStyle = '#3abc95'
    }

    ctx.fillRect(position.x, position.y, GRID_SIZE, GRID_SIZE)
  })
}

const moveSnake = () => {
  if (!direction) return

    const head = snake[snake.length - 1]

    switch (direction) {
      case 'right':
        snake.push({ x: head.x + GRID_SIZE, y: head.y })
        break;
      case 'left':
        snake.push({ x: head.x - GRID_SIZE, y: head.y })
        break;
      case 'up':
        snake.push({ x: head.x, y: head.y - GRID_SIZE })
        break;
      case 'down':
        snake.push({ x: head.x, y: head.y + GRID_SIZE })
        break;
      default:
        break;
    }

    snake.shift()
}

const handleKeyPress = (event) => {
  const { key } = event

  if (event.repeat) {
    return
  }

  if (key === 'ArrowRight' && direction !== 'left') {
    direction = 'right'
  }
  if (key === 'ArrowLeft' && direction !== 'right') {
    direction = 'left'
  }
  if (key === 'ArrowUp' && direction !== 'down') {
    direction = 'up'
  }
  if (key === 'ArrowDown' && direction !== 'up') {
    direction = 'down'
  }
}

const incrementScore = () => {
  const formatNumber = (num) => {
    return num < 10 ? `0${num}` : num
  }
    score.innerText = formatNumber(+score.innerText + 5).toString()
}

const checkEat = () => {
  const head = snake[snake.length - 1]
  
  if (head.x === food.x && head.y === food.y) {
    let x = randomPosition()
    let y = randomPosition()

    snake.push(head)
    eatingEffect.play()

    while (snake.find((position) => position.x === x && position.y === y)) {
      x = randomPosition(), 
      y = randomPosition()
    }
    
    food.x = x
    food.y = y
    incrementScore()
  }

}

const checkCollision = ( snakeSegments ) => {
  const MAX_WIDTH = canvas.width
  const MAX_HEIGHT = canvas.height

  const head = snakeSegments[snakeSegments.length - 1]
  const neckIndex = snakeSegments.length - 2

  const wallCollision = head.x < 0 || head.x >= MAX_WIDTH || head.y < 0 || head.y >= MAX_HEIGHT

  const selfCollision = snakeSegments.find((position, index) => {
    return index < neckIndex && position.x === head.x && position.y === head.y
  })

  return wallCollision || selfCollision
}

const handleStartGameButton = () => {
  direction = 'up'
  startButton.classList.add('hidden')
  canvas.style.filter = "blur(0)"
}

const handleRestartGameButton = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  canvas.style.filter = "blur(0)"
  gameOverContainer.classList.add('hidden')
  drawGrid()
  drawSnake()
  drawFood()
}

function endGame() {
  direction = undefined
  canvas.style.filter = "blur(4px)"
  const gameOverScore = document.getElementById('game-over-score')
  gameOverScore.innerText = score.innerText
  gameOverContainer.classList.remove('hidden')
}

const gameLoop = () => {
  clearTimeout(interval)

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawGrid()
  drawSnake()
  drawFood()
  moveSnake()
  checkEat()

  if (checkCollision(snake)) {
    clearTimeout(interval)
    endGame()
    return
  }

  interval = setTimeout(() => {
    gameLoop()
  }, 200)

}
gameLoop()

document.addEventListener('keydown', (event) => {
  handleKeyPress(event)
})