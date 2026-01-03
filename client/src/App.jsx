import { useContext, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom' 
import Login from './dashboard/pages/Login';
import MainLayout from './dashboard/layout/MainLayout';
import Adminindex from './dashboard/pages/Adminindex';
import ProtectDashboard from './middleware/ProtectDashboard';
import ProtectRole from './middleware/ProtectRole';
import Unable from './dashboard/pages/Unable';
import Profile from './dashboard/pages/Profile';
import News from './dashboard/pages/News';
import AddWriter from './dashboard/pages/AddWriter';
import Writers from './dashboard/pages/Writers';
import Writerindex from './dashboard/pages/writerIndex';
import CreateNews from './dashboard/pages/CreateNews';
import storeContext from './context/storeContext';
import EditWriter from './dashboard/pages/EditWriter';
import EditNews from './dashboard/pages/EditNews';
import DashboardLanding from './dashboard/pages/DashboardLanding';
import NewsDetail from './dashboard/pages/NewsDetail';
 

function App() { 

   const {store} = useContext(storeContext)

   // Debug: Log userInfo, token, and localStorage token after login
   console.log('UserInfo:', store?.userInfo);
   console.log('Token:', store?.token);
   console.log('LocalStorage Token:', localStorage.getItem('newsToken'));

   // Wait for userInfo to be loaded (not null/undefined) only if token exists
   if (store.token && (store.userInfo === undefined || store.userInfo === null || store.userInfo === "")) {
     return <div>Loading...</div>;
   }

  return (
     <BrowserRouter>
     <Routes>
      <Route path='/login' element={<Login/>} />
      <Route path='/dashboard' element={<ProtectDashboard/>}>
        <Route path='' element={<DashboardLanding/>} />
        <Route path='unable-access' element={<Unable/>} />
        <Route path='profile' element={<Profile/>} />
        <Route path='news' element={<News/>} />
        <Route path='' element={<MainLayout/>} >
          <Route path='' element={<Navigate to='/dashboard' />} />
          <Route path='news/detail/:newsId' element={<NewsDetail/>} />
          <Route path='' element={<ProtectRole role='admin' />}>
            <Route path='admin' element={<Adminindex/>} />
            <Route path='writer/add' element={<AddWriter/>} />
            <Route path='writers' element={<Writers/>} />
            <Route path='writer/edit/:id' element={<EditWriter/>} />
          </Route>
          <Route path='' element={<ProtectRole role='writer' />}>
            <Route path='writer' element={<Writerindex/>} />
            <Route path='news/create' element={<CreateNews/>} />
            <Route path='news/edit/:news_id' element={<EditNews/>} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<Unable />} />
     </Routes>
     
     </BrowserRouter>
  )
}

export default App