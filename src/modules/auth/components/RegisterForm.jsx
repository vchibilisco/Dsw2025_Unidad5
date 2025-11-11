import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Input from './Input';
import Button from '../../shared/components/Button';
import useAuth from '../hook/useAuth';

function RegisterForm() {
  const [errorMessage, setErrorMessage] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
    },
  });

  const navigate = useNavigate();
  const { register: registerUser } = useAuth();

  const onValid = async ({ username, password, email, role }) => {
    setErrorMessage('');

    try {
      const { error } = await registerUser(username, password, email, role);

      if (error) {
        setErrorMessage(error.frontendErrorMessage ?? 'No se pudo completar el registro');

        return;
      }

      navigate('/login');
    } catch (err) {
      console.error(err);
      setErrorMessage('Llame a soporte');
    }
  };

  return (
    <form
      className='flex flex-col gap-20 bg-white p-8 sm:w-md sm:gap-4 sm:rounded-lg sm:shadow-lg'
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
        label='Email'
        { ...register('email', {
          required: 'Email es obligatorio',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Formato de email invalido',
          },
        }) }
        error={errors.email?.message}
      />
      <Input
        label='Contrasena'
        type='password'
        { ...register('password', {
          required: 'Contrasena es obligatoria',
          minLength: {
            value: 6,
            message: 'La contrasena debe tener al menos 6 caracteres',
          },
        }) }
        error={errors.password?.message}
      />
      <Input
        label='Confirmar contrasena'
        type='password'
        { ...register('confirmPassword', {
          required: 'Confirmar contrasena es obligatorio',
          validate: (value) =>
            value === getValues('password') || 'Las contrasenas no coinciden',
        }) }
        error={errors.confirmPassword?.message}
      />
      <div className='flex flex-col gap-2'>
        <label>Rol</label>
        <select
          className='text-[1.3rem]'
          { ...register('role', {
            required: 'Rol de usuario es obligatorio',
          }) }
        >
          <option value='Client'>Cliente</option>
          <option value='Admin'>Admin</option>
        </select>
        {errors.role?.message && <p className='text-red-500'>{errors.role.message}</p>}
      </div>
      {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
      <Button type='submit'>Registrarse</Button>
      <Button type='button' onClick={() => navigate('/login')}>Iniciar Sesión</Button>
    </form>
  );
}

export default RegisterForm;
