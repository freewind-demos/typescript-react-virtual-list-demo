// 引入 React 挂载能力。
import ReactDOM from 'react-dom/client'
// 引入 PicoCSS 默认浅色主题样式。
import '@picocss/pico/css/pico.min.css'
// 引入页面主组件。
import { App } from './App'

// 挂载应用到根节点。
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />)
