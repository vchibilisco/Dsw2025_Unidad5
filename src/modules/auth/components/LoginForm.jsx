import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import useAuth from '../hook/useAuth';
import { frontendErrorMessage } from '../helpers/backendError';

function LoginForm({ onSuccess }) {
  const [errorMessage, setErrorMessage] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { username: '', password: '' } });

  const navigate = useNavigate();

  const { signin } = useAuth();

  const onValid = async (formData) => {
    try {
      const { error } = await signin(formData.username, formData.password);

      if (error) {
        setErrorMessage(error.frontendErrorMessage);

        return;
      }

      if (onSuccess) {
        onSuccess(); // Cierra el modal si se usa como modal
      } else {
        navigate('/admin/home'); // Redirige si se usa en la ruta normal
      }
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
        gap-20
        bg-white
        p-8
        sm:w-md
        sm:gap-4
        sm:rounded-lg
        sm:shadow-lg
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

      <Button type='submit'>Iniciar Sesión</Button>
      <Button
  variant='secondary'
  type='button'
  onClick={() => {
    if (onSuccess) {
      onSuccess('register'); // Indica que se quiere abrir el registro
    } else {
      navigate('/signup'); // Ruta tradicional
    }
  }}
>
  Registrar Usuario
</Button>
      {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
    </form>
  );
};

export default LoginForm;
