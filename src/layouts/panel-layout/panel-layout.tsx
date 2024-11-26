import React from 'react'
import { Outlet } from "react-router-dom";
import styles from './panel-layout.module.scss'
import Sidebar from '../../components/sidebar/sidebar';
import BottomBar from '../../components/bottom-bar/bottom-bar';

const PanelLayout = () => {
   return (
      <div className={styles.layout}>
         <BottomBar />
         <Sidebar />
         <div className={styles.content}>
            <Outlet />
         </div>
      </div>
   )
}

export default PanelLayout
