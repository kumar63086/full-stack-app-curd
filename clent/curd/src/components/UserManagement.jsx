import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, addUser, updateUser, deleteUser, clearError } from '../features/Users/userSlice'; // Adjust the import path accordingly
import { Button, Modal, Form, Input, Table, notification } from 'antd';
import { ToastContainer, toast } from 'react-toastify';
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import 'react-toastify/dist/ReactToastify.css';
import './UserManagement.css'
const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.users);
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', age: '' });
  const [loadingSubmit, setLoadingSubmit] = useState(false); // Loading state for submit actions

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.age) {
      toast.error({ message: 'Error', description: 'All fields are required!' });
      return;
    }

    setLoadingSubmit(true); // Start loading when submitting
    try {
      if (userId) {
        await dispatch(updateUser({ id: userId, data: formData }));
        toast.success({ message: 'Success', description: 'User updated successfully!' });
      } else {
        await dispatch(addUser(formData));
        toast.success({ message: 'Success', description: 'User added successfully!' });
      }
    } catch (err) {
      // Handle specific error messages if necessary
    } finally {
      setFormData({ name: '', email: '', age: '' });
      setUserId(null);
      setIsModalVisible(false);
      setLoadingSubmit(false); // Stop loading
    }
  };

  const handleEdit = (user) => {
    setFormData({ name: user.name, email: user.email, age: user.age });
    setUserId(user.id);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    await dispatch(deleteUser(id));
  };
  
  useEffect(() => {
    if (error) {
      toast.error({ message: 'Error', description: error });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Define columns for the Ant Design Table
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, user) => (
        <>
          <span  class="btn btn-dark m-2"  onClick={() => handleEdit(user)}>
            <AiOutlineEdit  style={{ fontSize: '18px' }} /> 
          </span>
          <span   className="btn btn-danger" onClick={() => handleDelete(user.id)}>
            <AiOutlineDelete style={{ fontSize: '18px' }} /> 
          </span>
        </>
      ),
    },
  ];

  return (
    <div className=' container' >
      <div className='row'>
     <div className='col-md-12'>
     <h1 className='text-center m-2'>User Management</h1>
      {loading && <p>Loading...</p>}
      <div className='text-end mb-2'>
      <button  class="btn btn-dark " onClick={() => setIsModalVisible(true)}>Add User</button>
      </div>
      <Modal 
      
        title={userId ? 'Edit User' : 'Add User'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSubmit}
        confirmLoading={loadingSubmit} // Show loading state on modal confirm button
      >
        <Form>
          <Form.Item label="Name" required>
            <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter Name" />
          </Form.Item>
          <Form.Item label="Email" required>
            <Input name="email" value={formData.email} onChange={handleInputChange} placeholder="Enter Email" />
          </Form.Item>
          <Form.Item label="Age" required>
            <Input name="age" type="number" value={formData.age} onChange={handleInputChange} placeholder="Enter Age" />
          </Form.Item>
        </Form>
      </Modal>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id" // Assuming 'id' is the unique key for each user
        className="table-dark"
      />
      <ToastContainer />

     </div>
      </div>
  
    </div>
  );
};

export default UserManagement;
