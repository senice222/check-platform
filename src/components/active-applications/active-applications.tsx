import { DownloadSvg } from '../svgs/svgs'
import ActiveTable from '../tables/active-table/active-table'
import Button from '../ui/button/button'
import style from './active-applications.module.scss'

const ActiveApplications = () => {
   return (
      <div className={style.pageContainer}>
         <div className={style.wrapper}>
            <div className={style.topic}>
               <h2>Активные заявки</h2>
               <Button
                  icon={<DownloadSvg />}
                  label="Экспортировать в XLS"
                  onClick={() => console.log('click')}
                  style={{ width: 200, height: 32, borderRadius: 10 }}
                  styleLabel={{ fontSize: 14, fontWeight: 500 }}
               />
            </div>
            <ActiveTable />
         </div>
      </div>
   )
}

export default ActiveApplications
