import { Routes, Route } from 'react-router-dom';
import { Dashboard } from '../src/pages/dashboard.jsx';
import { CreateQuote } from '../src/pages/createQuote.jsx';
import { ProfilePage } from '../src/pages/profile.jsx'
import { NotificationsPage } from '../src/pages/notification.jsx';
import { SettingsPage } from '../src/comps/navBar.jsx';

export function AppRouter(){
   return( 
        <Routes>
            <Route path='/'element={<Dashboard />} />
            <Route path='/createQuote' element={<CreateQuote />} />
            <Route path='/profile' element={<ProfilePage />} />
            <Route path='/settings' element={<SettingsPage />}/>
            <Route path='/notifications' element={<NotificationsPage />}/>
        </Routes>
   )
}