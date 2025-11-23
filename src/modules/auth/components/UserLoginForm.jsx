import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import useAuth from '../hook/useAuth';
import { frontendErrorMessage } from '../helpers/backendError';

function UserLoginForm({ onSuccess }) {
  const [errorMessage, setErrorMessage] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { username: '', password: '' } });

  const { signin } = useAuth();

  const onValid = async (formData) => {
    try {
      const { error } = await signin(formData.username, formData.password);

      if (error) {
        setErrorMessage(error.frontendErrorMessage);

        return;
      }
      onSuccess(); 
      
    } catch (error) {
      if (error?.response?.data?.code) {
        setErrorMessage(frontendErrorMessage[error?.response?.data?.code]);
      } else if (error?.response?.data) {
    
    setErrorMessage('Usuario o contraseña incorrectos');
  } else {
        setErrorMessage('Llame a soporte');
      }
    }
  };

  return (
    <form className='
        flex
        flex-col
        gap-4
        w-full
        
      '
    onSubmit={handleSubmit(onValid)}
    >
      <Input
        label='Usuario'
        { ...register('username', {
          required: 'Usuario es obligatorio',
        }) }
        error={errors.username?.message}
      />
      <Input
        label='Contraseña'
        { ...register('password', {
          required: 'Contraseña es obligatorio',
        }) }
        type='password'
        error={errors.password?.message}
      />

      <Button type='submit' className='w-full mt-2 text-sm font-medium'>Iniciar Sesión</Button>
      
      {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
    </form>
  );
};

export default UserLoginForm;
