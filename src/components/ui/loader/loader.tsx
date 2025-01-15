import { ClipLoader } from "react-spinners";
import styles from './loader.module.scss';

const Loader = () => {
   return (
      <div className={styles.loaderWrapper}>
         <ClipLoader color="#007AFF" size={40} />
      </div>
   );
};

export default Loader; 