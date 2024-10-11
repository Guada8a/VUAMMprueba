// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Button, Input, DatePicker } from 'antd'
import PropTypes from 'prop-types';
import 'antd/dist/reset.css'
import DashboardCard from './components/DashboardCard'

const MiBoton = ({ children, ...props }) => (
  <Button type="primary" {...props}>{children}</Button>
)

const MiInput = (props) => (
  <Input {...props} />
)

const MiDatePicker = (props) => (
  <DatePicker {...props} />
)

const render = (containerId, Component) => {
  ReactDOM.createRoot(document.getElementById(containerId)).render(
    <React.StrictMode>
      <Component />
    </React.StrictMode>
  )
}

// Exporta los componentes y la función de renderizado
export { MiBoton, MiInput, MiDatePicker, DashboardCard, render }

// Define los tipos de las propiedades
MiBoton.propTypes = {
  children: PropTypes.node
}