import { Routes, Route } from 'react-router-dom';
import { Dashboard } from '../src/pages/dashboard.jsx';
import { CreateQuote } from '../src/pages/createQuote.jsx';

export function AppRouter(){
   return( 
        <Routes>
            <Route path='/'element={<Dashboard />} />
            <Route path='/createQuote' element={<CreateQuote />} />
        </Routes>
   )
}