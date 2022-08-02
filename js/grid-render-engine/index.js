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
    scale: 0.5,
    targetScale: 1,
    inertia: true,
  }
  //网格样式
  gridStyle = {
    size: 20
  }
  //坐标标尺样式
  scaleStyle = {
    width: 40
  }
  //鼠标事件属性
  mouse = {
    pos: null,
    wheelPos: null,
    moveOrigin: null,
    cameraOrigin: null,
    moving: false
  }
  lastTickTime = null
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
      this.mouse.pos = new Vector2(e.offsetX, e.offsetY)
      this.mouse.move = new Vector2(0, 0)
      this.mouse.moveOrigin = new Vector2(e.offsetX, e.offsetY)
      this.mouse.cameraOrigin = this.camera.pos.clone()
      this.mouse.moving = true
    })
    this.userCanvas.addEventListener('mouseup', (e) => {
      let pos = new Vector2(e.offsetX, e.offsetY)
      this.mouse.pos = pos
      this.mouse.moving = false
    })
    this.userCanvas.addEventListener('mousemove', (e) => {

      this.mouse.pos = new Vector2(e.offsetX, e.offsetY)
      if (this.mouse.moving) {
        // this.mouse.move = (new Vector2(e.movementX, e.movementY)).mul(this.camera.scale, true)
        const curMousePos = new Vector2(e.offsetX, e.offsetY)
        const moveVec = curMousePos
          .sub(this.mouse.moveOrigin, true)
          .mul(this.camera.scale, true)
        this.camera.pos = this.mouse.cameraOrigin.sub(moveVec, true)
      }
    })
    this.userCanvas.addEventListener('wheel', (e) => {
      const sizeChange = Math.sign(e.deltaY) == 1 ? 1.1 : 1 / 1.1
      this.camera.targetScale *= sizeChange
      if (this.camera.targetScale > 1) {
        this.camera.targetScale = 1
      }
      this.mouse.pos = new Vector2(e.offsetX, e.offsetY)
      this.mouse.wheelPos = new Vector2(e.offsetX, e.offsetY)
    })
  }
  //添加触摸事件
  addTouchEvent() {
    if (!this.userCanvas) {
      return
    }
    // this.userCanvas.addEventListener('touchstart', (e) => {
    //   this.mouse.pos = new Vector2(e.offsetX, e.offsetY)
    //   this.mouse.moveOrigin = new Vector2(e.offsetX, e.offsetY)
    //   this.mouse.cameraOrigin = this.camera.pos.clone()
    //   this.mouse.moving = true
    // })
    // this.userCanvas.addEventListener('touchend', () => {
    //   this.mouse.pos = new Vector2(e.offsetX, e.offsetY)
    //   this.mouse.moving = false
    // })
    // this.userCanvas.addEventListener('touchmove', (e) => {
    //   this.mouse.pos = new Vector2(e.offsetX, e.offsetY)
    //   if (this.mouse.moving) {
    //     const curMousePos = new Vector2(e.offsetX, e.offsetY)
    //     const moveVec = curMousePos
    //       .sub(this.mouse.moveOrigin, true)
    //       .mul(this.camera.scale, true)
    //     this.camera.pos = this.mouse.cameraOrigin.sub(moveVec, true)
    //   }
    // })
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
  draw() {
    this.initCanvasSetting()
    this.animation()
    this.drawScale()
    this.drawGrid()
  }
  drawGrid() {
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
    gridCtx.fillStyle = "rgb(255,255,255)"
    gridCtx.beginPath()
    gridCtx.fillRect(0, 0, width, height);

    gridCtx.strokeStyle = 'rgb(0,0,0)'
    gridCtx.lineWidth = 1

    // for (let y = 0; y < gridCountY; y++) {
    //   for (let x = 0; x < gridCountX; x++) {
    //     let gridPosX = gridIndexX + x
    //     let gridPosY = gridIndexY + y
    //     let gridReallPosX = (firstGridPosX + x * gridSize) / scale
    //     let gridReallPosY = (firstGridPosY + y * gridSize) / scale

    //     if((gridPosX+gridPosY)%2 == 0){
    //       gridCtx.fillStyle='rgb(0,0,0)'
    //     }else{
    //       gridCtx.fillStyle='rgb(255,255,255)'
    //     }

    //     gridCtx.beginPath()
    //     // gridCtx.fillText(`(${gridPosX},${gridPosY})`, gridReallPosX, gridReallPosY)
    //     gridCtx.fillRect(gridReallPosX,gridReallPosY,gridSize/scale,gridSize/scale);
    //   }
    // }

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
  drawScale() {
   

  }
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
  animation() {
    if (this.lastTickTime == null) {
      this.lastTickTime = new Date()
      return
    }
    let nowTime = new Date()
    let tickTime = nowTime - this.lastTickTime
    this.lastTickTime = nowTime
    this.scaleChangeAnimation(tickTime)
    // this.camInertiaMove(tickTime)
  }
  scaleChangeAnimation(tickTime) {
    if (this.mouse.wheelPos) {
      let { scale, targetScale } = this.camera
      scale += (targetScale - scale) * (tickTime / 1000) * 10
      // console.log(tickTime);
      const gridMousePos = this.getGridMousePos(this.mouse.wheelPos)
      this.cameraChangeScale(gridMousePos, scale)
    }
  }
  // camInertiaMove(tickTime) {
  //   let { moving, move } = this.mouse
  //   if (!moving && move) {
  //     this.camera.pos.sub(move)
  //     let length = move.length()
  //     if (length > 0) {
  //       let drag = tickTime / 200 * this.camera.scale
  //       drag = Math.min(length, drag)
  //       move.sub(move.normalize(true).mul(drag, true))
  //       this.mouse.move = move
  //     }
  //   }
  // }
}
