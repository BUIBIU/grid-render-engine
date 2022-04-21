import Vector2 from './vector2.js'
export default class GridRenderEngine {
  userCanvas = null
  gridCanvas = null
  scaleCanvas = null
  camera = {
    posX: 0,
    posY: 0,
    scale: 1
  }
  gridStyle = {
    size: 20
  }
  scaleStyle = {
    width: 10
  }
  constructor(userCanvas) {
    this.userCanvas = userCanvas
    this.init()
  }
  init() {
    this.gridCanvas = document.createElement('canvas')
    this.scaleCanvas = document.createElement('canvas')
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
    const { posX, posY } = this.camera
    const { size: gridSize } = this.gridStyle
    const { scale } = this.camera
    const width = this.gridCanvas.width
    const height = this.gridCanvas.height
    const reallWidth = width * scale
    const reallHeight = height * scale
    const reallMaxX = posX + reallWidth
    const reallMaxY = posY + reallHeight

    const firstGridPosX = (((posX / gridSize) | 0) + 1) * gridSize
    const firstGridPosY = (((posY / gridSize) | 0) + 1) * gridSize
    gridCtx.strokeStyle = 'rgb(0,0,0)'
    for (let i = firstGridPosX; i < reallMaxX; i += gridSize) {
      gridCtx.beginPath()
      gridCtx.moveTo(i / scale, 0)
      gridCtx.lineTo(i / scale, height)
      gridCtx.stroke()
    }
    for (let i = firstGridPosY; i < reallMaxY; i += gridSize) {
      gridCtx.beginPath()
      gridCtx.moveTo(0, i / scale)
      gridCtx.lineTo(width, i / scale)
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
}
