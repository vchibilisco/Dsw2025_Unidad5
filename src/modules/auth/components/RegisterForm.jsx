import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import useAuth from '../hook/useAuth';
import { frontendErrorMessage } from '../helpers/backendError';
import axios from 'axios';

function RegisterForm() {
  const [errorMessage, setErrorMessage] = useState('');
  const [roles, setRoles] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'User',
    }
  });

  const navigate = useNavigate();
  const { signup } = useAuth();

  const passwordValue = watch("password");

  useEffect(() => {
  setRoles(['User', 'Admin']);
}, []);

  const onValid = async (formData) => {
    try {
      const { error } = await signup(
        formData.username,
        formData.email,
        formData.password,
        formData.role
      );

      if (error) {
        setErrorMessage(error.frontendErrorMessage);
        return;
      }

      navigate('/login');

    } catch (error) {
      if (error?.response?.data?.code) {
        setErrorMessage(frontendErrorMessage[error?.response?.data?.code]);
      } else {
        setErrorMessage('Llame a soporte');
      }
    }
  };

  return (
    <form
      className='
        flex flex-col gap-20 bg-white p-8
        sm:w-md sm:gap-4 sm:rounded-lg sm:shadow-lg
      '
      onSubmit={handleSubmit(onValid)}
    >
      <Input
        label='Usuario'
        {...register('username', { required: 'Usuario es obligatorio' })}
        error={errors.username?.message}
      />

      <Input
        label='Email'
        {...register('email', { required: 'Email es obligatorio' })}
        error={errors.email?.message}
      />

      <Input
        label='Contraseña'
        type='password'
        {...register('password', { required: 'Contraseña es obligatoria' })}
        error={errors.password?.message}
      />

      {/* ✔ Confirmar contraseña */}
      <Input
        label='Confirmar contraseña'
        type='password'
        {...register('confirmPassword', {
          required: 'Debe confirmar la contraseña',
          validate: (value) =>
            value === passwordValue || 'Las contraseñas no coinciden',
        })}
        error={errors.confirmPassword?.message}
      />

      {/* SELECT DE ROLES */}
      <div className="flex flex-col gap-1">
        <label className="font-semibold">Rol</label>
        <select
          className="border p-2 rounded"
          {...register('role', { required: true })}
        >
          {roles.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      <Button type="submit">Registrarse</Button>
      <Button variant="secondary" onClick={() => navigate('/login')}>
        Volver al Login
      </Button>

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </form>
  );
}

export default RegisterForm;
