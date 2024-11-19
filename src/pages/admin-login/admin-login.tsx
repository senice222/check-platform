import { useState } from "react";
import styles from "./admin-login.module.scss";
import { ClipLoader } from "react-spinners";
import PopUp from "../../components/ui/popup/popup";
import Input from "../../components/ui/input/input";
import eye from '../../assets/tail-icon.png'
import Button from "../../components/ui/button/button";

const AdminLogin = () => {
   const [login, setLogin] = useState("");
   const [password, setPassword] = useState("");
   const [visible, setVisible] = useState(true);
   const [text, setText] = useState({ text: "1", title: "2" });

   return (
      <>
         <PopUp
            visible={visible}
            setVisible={setVisible}
            message={text?.text}
            title={text?.title}
            duration={5000}
         />
         <div className={styles.wrapper}>
            <div className={styles.loginContainer}>
               <h2>Вход для администраторов</h2>
               <form>
                  <div className={styles.inputGroup}>
                     <Input
                        placeholder="Логин"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                     />
                  </div>
                  <div className={styles.inputGroup}>
                     <Input
                        placeholder="Пароль"
                        toggleType={true}
                        icon={eye}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                     />
                  </div>
                  <Button
                     label={"Войти"}
                     onClick={() => {

                     }}
                  />
               </form>
            </div>
         </div>
      </>
   );
};

export default AdminLogin;

