const electron = require('electron')
const { app, BrowserWindow } = electron
const electronIsDev = require('electron-is-dev')
const electronDevtoolsInstaller = require('electron-devtools-installer')

const devtoolsInstaller = electronDevtoolsInstaller.default
const { REACT_DEVELOPER_TOOLS, MOBX_DEVTOOLS } = electronDevtoolsInstaller

const SAFE_TRANSPARENCY_DELAY = 100

if (process.platform === 'linux') {
  app.commandLine.appendSwitch('enable-transparent-visuals')
  app.disableHardwareAcceleration()
}

const createWindow = async () => {
  // workaround: https://github.com/electron/electron/issues/2170#issuecomment-361549395
  await new Promise(resolve => setTimeout(resolve, SAFE_TRANSPARENCY_DELAY))

  const { width, height, x, y } = electron.screen.getPrimaryDisplay().workArea

  const win = new BrowserWindow({
    width,
    height,
    x,
    y,
    frame: false,
    transparent: true,
    maximizable: false,
    minimizable: false,
    fullscreenable: false,
    resizable: false
  })

  if (electronIsDev) {
    await devtoolsInstaller(REACT_DEVELOPER_TOOLS)
    await devtoolsInstaller(MOBX_DEVTOOLS)
    win.webContents.openDevTools({ mode: 'undocked' })
  }

  electronIsDev
    ? win.loadURL('http://localhost:3000') // dev server by react-scripts
    : win.loadFile('build/index.html') // production bundle

  // win.on('closed', function () {})

  return win
}

app.on('ready', createWindow)

app.on('window-all-closed', app.quit)
