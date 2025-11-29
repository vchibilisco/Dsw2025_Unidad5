import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import useAuth from '../hook/useAuth';
import { frontendErrorMessage } from '../helpers/backendError';
import { useLocation } from 'react-router-dom';

function LoginForm() {
  const [errorMessage, setErrorMessage] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { username: '', password: '' } });

  const navigate = useNavigate();
  const location = useLocation();

  const { signin, signout } = useAuth();

  useEffect(() => {
    if (location.state?.authError) {
      setErrorMessage(location.state.authError);
      
      // Limpiamos el estado después de leerlo (opcional, pero buena práctica)
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);

  const onValid = async (formData) => {
    setErrorMessage('');
    try {
      const { error, data } = await signin(formData.username, formData.password);

      if (error) {
        setErrorMessage(error.frontendErrorMessage);

        return;
      }
      const userRole = data?.role || localStorage.getItem('role');
      if (userRole === 'Admin'){
        navigate('/admin/home');
      } else{
        setErrorMessage('Tu cuenta no tiene autorización para acceder al panel de administración.');
        
        // Limpiamos la sesión inmediatamente para evitar que quede logueado
        signout();
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
