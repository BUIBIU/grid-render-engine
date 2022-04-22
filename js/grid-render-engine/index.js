import Vector2 from './vector2.js'
export default class GridRenderEngine {
  //输出canvas
  userCanvas = null
  //网格的canvas
  gridCanvas = null
  //坐标标尺的canvas
  scaleCanvas = null
  //视窗参数
  camera = {
    pos: new Vector2(0, 0),
    scale: 1
  }
  //网格样式
  gridStyle = {
    size: 20
  }
  //坐标标尺样式
  scaleStyle = {
    width: 20
  }
  //鼠标事件属性
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
  //添加鼠标事件
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
  //添加触摸事件
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
  //初始化canvas大小参数
  initCanvasSetting() {
    const userCanvasWidth = this.userCanvas.clientWidth
    const userCanvasHeight = this.userCanvas.clientHeight

    this.userCanvas.width = userCanvasWidth
    this.userCanvas.height = userCanvasHeight

    const gridCanvasWidth = userCanvasWidth - this.scaleStyle.width * 2
    const gridCanvasHeight = userCanvasHeight - this.scaleStyle.width * 2
    this.gridCanvas.width = gridCanvasWidth
    this.gridCanvas.height = gridCanvasHeight

    this.scaleCanvas.width = userCanvasWidth
    this.scaleCanvas.height = userCanvasHeight
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

    const gridIndexX = Math.floor(posX / gridSize)
    const gridIndexY = Math.floor(posY / gridSize)

    const firstGridPosX = gridIndexX * gridSize - posX
    const firstGridPosY = gridIndexY * gridSize - posY

    const gridCountX = ((reallWidth / gridSize) | 0) + 2
    const gridCountY = ((reallHeight / gridSize) | 0) + 2

    gridCtx.strokeStyle = 'rgb(0,0,0)'
    gridCtx.lineWidth = 1
    for (let i = 0; i < gridCountX; i++) {
      const x = (firstGridPosX + i * gridSize) / scale
      const lineIndex = gridIndexX + i
      if (lineIndex % 10 == 0) {
        gridCtx.strokeStyle = 'rgb(255,0,0)'
        gridCtx.lineWidth = 3
      } else {
        gridCtx.strokeStyle = 'rgb(0,0,0)'
        gridCtx.lineWidth = 1
      }

      gridCtx.beginPath()
      gridCtx.moveTo(x, 0)
      gridCtx.lineTo(x, height)
      gridCtx.stroke()
    }
    for (let i = 0; i < gridCountY; i++) {
      const y = (firstGridPosY + i * gridSize) / scale
      const lineIndex = gridIndexY + i
      if (lineIndex % 10 == 0) {
        gridCtx.strokeStyle = 'rgb(255,0,0)'
        gridCtx.lineWidth = 3
      } else {
        gridCtx.strokeStyle = 'rgb(0,0,0)'
        gridCtx.lineWidth = 1
      }
      gridCtx.beginPath()
      gridCtx.moveTo(0, y)
      gridCtx.lineTo(width, y)
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
