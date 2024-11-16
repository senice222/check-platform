import { FC, ReactNode } from "react";
import { Route, Routes } from "react-router-dom";
import { ROUTES } from "../shared/routing/routes";
import ClientLogin from "../pages/client-login/client-login";


export const AppRouter: FC = () => {

  return (
    <>
      <Route path={ROUTES.root} element={<ClientLogin />} />
    </>
  );
};
