import { Routes, Route } from 'react-router-dom';
import { AddEdit } from './AddEdit';
import { List } from './List';

export function UsersLayout() {
  return (
    <div className='p__4'>
      <div className='container'>
        <Routes>
          <Route index element={<List />} />
          <Route path='add' element={<AddEdit />} />
          <Route path='edit/:id' element={<AddEdit />} />
        </Routes>
      </div>
    </div>
  );
}
