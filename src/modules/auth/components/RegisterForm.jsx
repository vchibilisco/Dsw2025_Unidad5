import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import useAuth from '../hook/useAuth';
import { frontendErrorMessage } from '../helpers/backendError';

function RegisterForm() {
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
  const navigate = useNavigate();

  const onValid = async (formData) => {
    const payload = {
      userName: formData.userName,
      email: formData.email,
      password: formData.password,
      name: formData.name,
      phoneNumber: formData.phoneNumber,
      role: formData.role,
    };

    try {
      const { error } = await signup(payload);

      if (error) {
        setErrorMessage(error.frontendErrorMessage || 'Error al registrar');

        return;
      }

      navigate('/login');
    } catch (error) {
      const code = error?.response?.data?.code;

      setErrorMessage(code ? frontendErrorMessage[code] : 'Llame a soporte');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        className="w-full max-w-sm flex flex-col gap-3 bg-white p-4 sm:p-6 rounded-lg shadow-lg"
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

        <div className="flex flex-col gap-1">
          <label htmlFor="roles" className="text-xs font-medium">
            Rol:
          </label>
          <select
            id="role"
            {...register('role', { required: 'Rol es obligatorio' })} // ✅ corregido
            className="..."
          >
            <option value="">Selecciona un rol</option>
            <option value="Customer">Cliente</option> // ✅ valor compatible con backend
            <option value="Admin">Admin</option>
          </select>
          {errors.role && (
            <p className="text-red-500 text-xs">{errors.role.message}</p>
          )}
        </div>

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
          <Button type="submit" className="w-full sm:w-auto text-xs">
            Registrar Usuario
          </Button>
          <Button
            variant="secondary"
            type="button"
            className="w-full sm:w-auto text-xs"
            onClick={() => navigate('/login')}
          >
            Iniciar Sesión
          </Button>
        </div>

        {errorMessage && (
          <p className="text-red-500 text-xs text-center">{errorMessage}</p>
        )}
      </form>
    </div>
  );
}

export default RegisterForm;