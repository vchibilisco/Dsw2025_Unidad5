import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import useAuth from '../hook/useAuth';
import { frontendErrorMessage } from '../helpers/backendError';

function LoginForm() {
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

      navigate('/admin/home');

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
        bg-white
        p-8
        sm:w-md
        mx-auto
        w-[70%]
        rounded-lg
        shadow-lg
      '
    onSubmit={handleSubmit(onValid)}
    >
      <Input
        className='h-10 text-base'
        label='Usuario'
        { ...register('username', {
          required: 'Usuario es obligatorio',
        }) }
        error={errors.username?.message}
      />
      <Input
        className='h-10 text-base'
        label='Contraseña'
        { ...register('password', {
          required: 'Contraseña es obligatorio',
        }) }
        type='password'
        error={errors.password?.message}
      />

      <Button type='submit' className='w-full text-base font-medium'>Iniciar Sesión</Button>
      <Button
        className='w-full text-base font-medium'
        variant='secondary'
        type='button'
        onClick={() => {
          navigate('/signup');
        }}
      >
      Registrar Usuario
      </Button>
      {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
    </form>
  );
};

export default LoginForm;
