import Vector2 from './vector2.js'
export default class GridRenderEngine {
  userCanvas = null
  gridCanvas = null
  scaleCanvas = null
  camera = {
    pos: new Vector2(0, 0),
    scale: 1
  }
  gridStyle = {
    size: 10
  }
  scaleStyle = {
    width: 10
  }
  mouse = {
    moveOrigin: null,
    cameraOrigin: null,
    moving: false
  }
  constructor(userCanvas) {
    this.userCanvas = userCanvas
    this.init()
  }
  init() {
    this.gridCanvas = document.createElement('canvas')
    this.scaleCanvas = document.createElement('canvas')
    this.addMouseEvent()
    // this.addTouchEvent()
  }
  addMouseEvent() {
    if (!this.userCanvas) {
      return
    }
    this.userCanvas.addEventListener('mousedown', (e) => {
      // console.log(e)
      this.mouse.moveOrigin = new Vector2(e.offsetX, e.offsetY)
      this.mouse.cameraOrigin = this.camera.pos.clone()
      this.mouse.moving = true
    })
    this.userCanvas.addEventListener('mouseup', () => {
      this.mouse.moving = false
    })
    this.userCanvas.addEventListener('mousemove', (e) => {
      if (this.mouse.moving) {
        const curMousePos = new Vector2(e.offsetX, e.offsetY)
        const moveVec = curMousePos
          .sub(this.mouse.moveOrigin, true)
          .mul(this.camera.scale, true)
        this.camera.pos = this.mouse.cameraOrigin.sub(moveVec, true)
      }
    })
    this.userCanvas.addEventListener('wheel', (e) => {
      const sizeChange = Math.sign(e.deltaY) == 1 ? 1.1 : 1 / 1.1
      // this.camera.scale += sizeChange
      const mousePos = new Vector2(e.offsetX, e.offsetY)
      const gridMousePos = this.getGridMousePos(mousePos)
      this.cameraChangeScale(gridMousePos, this.camera.scale * sizeChange)
      // console.log(e)
    })
  }
  addTouchEvent() {
    if (!this.userCanvas) {
      return
    }
    this.userCanvas.addEventListener('touchstart', (e) => {
      console.log(e)
      this.mouse.moveOrigin = new Vector2(e.offsetX, e.offsetY)
      this.mouse.cameraOrigin = this.camera.pos.clone()
      this.mouse.moving = true
    })
    this.userCanvas.addEventListener('touchend', () => {
      this.mouse.moving = false
    })
    this.userCanvas.addEventListener('touchmove', (e) => {
      if (this.mouse.moving) {
        const curMousePos = new Vector2(e.offsetX, e.offsetY)
        const moveVec = curMousePos
          .sub(this.mouse.moveOrigin, true)
          .mul(this.camera.scale, true)
        this.camera.pos = this.mouse.cameraOrigin.sub(moveVec, true)
      }
    })
  }
  initCanvasSetting() {
    const clientWidth = this.userCanvas.clientWidth
    const clientHeight = this.userCanvas.clientHeight
    this.userCanvas.width = clientWidth
    this.userCanvas.height = clientHeight
    const userCanvasWidth = clientWidth
    const userCanvasHeight = clientHeight
    const gridCanvasWidth = userCanvasWidth - this.scaleStyle.width * 2
    const gridCanvasHeight = userCanvasHeight - this.scaleStyle.width * 2
    this.gridCanvas.width = gridCanvasWidth
    this.gridCanvas.height = gridCanvasHeight
  }
  drawGrid() {
    this.initCanvasSetting()
    const gridCtx = this.gridCanvas.getContext('2d')
    const { x: posX, y: posY } = this.camera.pos
    const { size: gridSize } = this.gridStyle
    const { scale } = this.camera
    const width = this.gridCanvas.width
    const height = this.gridCanvas.height
    const reallWidth = width * scale
    const reallHeight = height * scale
    const reallMaxX = posX + reallWidth
    const reallMaxY = posY + reallHeight

    const firstGridPosX = ((posX / gridSize) | 0) * gridSize
    const firstGridPosY = ((posY / gridSize) | 0) * gridSize
    gridCtx.strokeStyle = 'rgb(0,0,0)'
    gridCtx.lineWidth = 1
    for (let i = firstGridPosX; i < reallMaxX; i += gridSize) {
      gridCtx.beginPath()
      gridCtx.moveTo((i - posX) / scale, 0)
      gridCtx.lineTo((i - posX) / scale, height)
      gridCtx.stroke()
    }
    for (let i = firstGridPosY; i < reallMaxY; i += gridSize) {
      gridCtx.beginPath()
      gridCtx.moveTo(0, (i - posY) / scale)
      gridCtx.lineTo(width, (i - posY) / scale)
      gridCtx.stroke()
    }
    const userCtx = this.userCanvas.getContext('2d')
    userCtx.drawImage(
      this.gridCanvas,
      this.scaleStyle.width,
      this.scaleStyle.width
    )
  }
  drawScale() {}
  cameraChangeScale(mousePos, targetScale) {
    const worldPos = mousePos
      .mul(this.camera.scale, true)
      .add(this.camera.pos, true)
    const afterChangeWorldPos = mousePos
      .mul(targetScale, true)
      .add(this.camera.pos, true)
    const moveVec = worldPos.sub(afterChangeWorldPos, true)
    // console.log(moveVec);
    this.camera.scale = targetScale
    this.camera.pos.add(moveVec)
  }
  getGridMousePos(pos) {
    const width = this.scaleStyle.width
    return pos.sub(new Vector2(width, width), true)
  }
}
