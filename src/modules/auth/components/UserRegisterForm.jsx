import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import useAuth from '../hook/useAuth';
import { frontendErrorMessage } from '../helpers/backendError';

function UserRegisterForm({ onSuccess }) {
  const [errorMessage, setErrorMessage] = useState('');
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      userName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
      phoneNumber: '',
      name: '',
    },
  });

  const { signup } = useAuth();

  const onValid = async (formData) => {
    const payload = {
      userName: formData.userName,
      email: formData.email,
      password: formData.password,
      name: formData.name,
      phoneNumber: formData.phoneNumber,
      role: 'Customer',
    };

    try {
      const { error } = await signup(payload);

      if (error) {
        setErrorMessage(error.frontendErrorMessage || 'Nombre de Usuario ya existe');

        return;
      }

      onSuccess();

    } catch (error) {
      const data = error?.response?.data;

      if (Array.isArray(data) && data.length > 0) {
        // Usa la descripción que viene del backend
        setErrorMessage(data[0].description);
      } else if (data?.code) {
        setErrorMessage(frontendErrorMessage[data.code] || 'Nombre de Usuario ya existe');
      } else {
        setErrorMessage('Llame a soporte');
      }
    }

  };

  return (

    <form
      className='w-full flex flex-col gap-4'
      onSubmit={handleSubmit(onValid)}
    >
      <Input
        label="Usuario"
        placeholder="Ingresar usuario"
        {...register('userName', {
          required: 'Usuario es obligatorio',
        })}
        error={errors.userName?.message}
        className="text-xs p-2"
      />

      <Input
        label="Email"
        type="email"
        placeholder="Ingresar email"
        {...register('email', {
          required: 'Email es obligatorio',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Email inválido',
          },
        })}
        error={errors.email?.message}
        className="text-xs p-2"
      />

      <Input
        label="Nombre completo"
        placeholder="Ingresar nombre"
        {...register('name', {
          required: 'El nombre es obligatorio',
          minLength: { value: 2, message: 'Debe tener al menos 2 caracteres' },
        })}
        error={errors.name?.message}
        className="text-xs p-2"
      />

      <Input
        label="Contraseña"
        type="password"
        autoComplete="new-password"
        placeholder="Ingresar contraseña"
        {...register('password', {
          required: 'Contraseña es obligatorio',
          minLength: { value: 8, message: 'Mínimo 8 caracteres' },
          pattern: {
            value:
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            message:
              'Debe incluir mayúscula, minúscula, número y símbolo',
          },
        })}
        error={errors.password?.message}
        className="text-xs p-2"
      />

      <Input
        label="Confirmar Contraseña"
        type="password"
        autoComplete="new-password"
        placeholder="Repetir contraseña"
        {...register('confirmPassword', {
          required: 'La confirmación es obligatoria',
          validate: (value) =>
            value === watch('password') || 'Las contraseñas no coinciden',
        })}
        error={errors.confirmPassword?.message}
        className="text-xs p-2"
      />

      <Input
        label="Teléfono"
        placeholder="Ingresar número de teléfono"
        {...register('phoneNumber', {
          required: 'El número de teléfono es obligatorio',
          pattern: {
            value: /^[0-9]{7,15}$/,
            message: 'Número inválido',
          },
        })}
        error={errors.phoneNumber?.message}
        className="text-xs p-2"
      />

      <div className="flex flex-col sm:flex-row gap-2 mt-2">
        <Button type="submit" className="w-full  text-xs">
          Registrar Usuario
        </Button>
      </div>

      {errorMessage && (
        <p className="text-red-500 text-xs text-center">{errorMessage}</p>
      )}
    </form>

  );
}

export default UserRegisterForm;