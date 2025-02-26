import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import TaskManager from './App.jsx'
import Spline from "@splinetool/react-spline/next";

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <Spline scene="https://prod.spline.design/g492ldEQrkUfS7zK/scene.splinecode" />
    <TaskManager /></StrictMode>
)


