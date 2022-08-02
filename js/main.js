import GridRenderEngine from './grid-render-engine/index.js'
console.log()
window.onload = () => {
  let userCanvas = document.getElementById('canvas')
  let gridRender = new GridRenderEngine(userCanvas)
  function draw() {
    gridRender.draw()
    gridRender.camera.posX += 0.5
    gridRender.camera.posY += 0.5
    window.requestAnimationFrame(draw)
  }
  window.requestAnimationFrame(draw)
}

