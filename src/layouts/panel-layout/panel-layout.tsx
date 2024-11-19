import React from 'react'
import { Outlet } from "react-router-dom";
import styles from './panel-layout.module.scss'
import Sidebar from '../../components/sidebar/sidebar';

const PanelLayout = () => {
   return (
      <div className={styles.layout}>
         <Sidebar />
         <div className={styles.content}>
            <Outlet />
         </div>
      </div>
   )
}

export default PanelLayout
