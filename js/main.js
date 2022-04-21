import GridRenderEngine from './grid-render-engine/index.js'
console.log()
window.onload = () => {
  let userCanvas = document.getElementById('canvas')
  let gridRender = new GridRenderEngine(userCanvas)
  gridRender.drawGrid()
}
