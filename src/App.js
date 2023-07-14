import React from 'react';
import './App.css';
import jwtDecode from 'jwt-decode';
import { Route, Routes } from "react-router-dom";
import { AuthContextProvider } from './context/AuthProvider';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPassPage from './pages/auth/ForgotPassPage';
import ChangePassPage from './pages/auth/ChangePassPage';
// user
import HomePage from './pages/user/HomePage';
import CategoryPage from './pages/user/CategoryPage';
import BudgetPage from './pages/user/BudgetPage';
import GoalPage from './pages/user/GoalPage';
import TransactionPage from './pages/user/TransactionPage';
import StatisticalPage from './pages/user/StatisticalPage';
// admin
import DashBoardPage from './pages/admin/DashBoardPage';
import CategoryAdminPage from './pages/admin/CategoryAdminPage';
import ManagerUserPage from './pages/admin/ManagerUserPage';
import TransactionTypePage from './pages/admin/TransactionTypePage';


function App() {
  const tokens = JSON.parse(localStorage.getItem("tokens"));
  const permission = tokens ? jwtDecode(tokens?.accessToken)?.authorities : null;

  return (
    <AuthContextProvider>
      <Routes>
        <Route path='/' element={<LoginPage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/register' element={<RegisterPage/>}/>
        <Route path='/forgot-pass' element={<ForgotPassPage />}/>
        {permission == "ADMIN" ? (
          <>
            <Route path='/home' element={<DashBoardPage />}/>
            <Route path='/category' element={<CategoryAdminPage />}/>
            <Route path='/user' element={<ManagerUserPage />}/>
            <Route path='/transaction-type' element={<TransactionTypePage />}/>
          </>
        ) : (
          <>
            <Route path='/home' element={<HomePage />}/>
            <Route path='/category' element={<CategoryPage />}/>
            <Route path='/budget' element={<BudgetPage />}/>
            <Route path='/goal' element={<GoalPage />}/>
            <Route path='/transaction' element={<TransactionPage />}/>
            <Route path='/statistical' element={<StatisticalPage />}/>
          </>
        )};
      </Routes>
    </AuthContextProvider>
  );
}

export default App;