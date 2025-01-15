import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./admin-login.module.scss";
import PopUp from "../../components/ui/popup/popup";
import Input from "../../components/ui/input/input";
import eye from '../../assets/tail-icon.png'
import Button from "../../components/ui/button/button";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { loginAdmin } from "../../store/slices/adminSlice";

const AdminLogin = () => {
   const [login, setLogin] = useState("");
   const [password, setPassword] = useState("");
   const [visible, setVisible] = useState(false);
   const [text, setText] = useState({ text: "", title: "" });
   
   const dispatch = useAppDispatch();
   const navigate = useNavigate();
   const { isLoading, error } = useAppSelector(state => state.admin);

   const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!login || !password) {
         setText({ text: "Заполните все поля", title: "Ошибка" });
         setVisible(true);
         return;
      }

      try {
         const result = await dispatch(loginAdmin({ login, password })).unwrap();
         if (result) {
            // После успешного логина делаем редирект
            navigate('/admin/active-applications', { replace: true });
         }
      } catch (error: any) {
         setText({ text: error, title: "Ошибка" });
         setVisible(true);
      }
   };

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
               <form onSubmit={handleLogin}>
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
                        type="password"
                        toggleType={true}
                        icon={eye}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                     />
                  </div>
                  <Button
                     label={isLoading ? "Загрузка..." : "Войти"}
                     type="submit"
                     disabled={isLoading}
                     style={{display: "flex", justifyContent: "center", alignItems: "center"}}
                     styleLabel={{color: "white"}}
                  />
               </form>
            </div>
         </div>
      </>
   );
};

export default AdminLogin;

