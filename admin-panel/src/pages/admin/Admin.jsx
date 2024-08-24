import { Route, Routes } from 'react-router-dom'
import Sidebar from '../../components/sidebar/Sidebar'
import './Admin.css'
import AddProduct from '../../components/addProduct/AddProduct'
import ListProduct from '../../components/listProduct/ListProduct'

const Admin = () => {
  return (
    <div className='admin'>
      <Sidebar />
      <Routes>
        <Route path='/addProduct' element={<AddProduct />} />
        <Route path='/listProduct' element={<ListProduct />} />
      </Routes>
    </div>
  )
}

export default Admin