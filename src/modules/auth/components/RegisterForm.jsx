import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import useAuth from '../hook/useAuth';
import { frontendErrorMessage } from '../helpers/backendError';

function RegisterForm({ onSuccess, fixedRole }) {
  const [errorMessage, setErrorMessage] = useState('');
  const [errorMessages, setErrorMessages] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  const navigate = useNavigate();
  const { register: registerUser } = useAuth();

  const onValid = async ({ username, password, email, role }) => {
    setErrorMessage('');
    setErrorMessages([]);
    const finalRole = fixedRole ?? role;

    try {
      const { error } = await registerUser(username, password, email, finalRole);

      if (error) {
        const detailedMessages = (error.errors || [])
          .map((err) => frontendErrorMessage[err.code] || err.message)
          .filter(Boolean);

        setErrorMessages(detailedMessages);
        setErrorMessage(
          error.frontendErrorMessage
          || detailedMessages[0]
          || error.backendMessage
          || 'No se pudo completar el registro',
        );

        return;
      }

      if (onSuccess) return onSuccess();

      navigate('/login');

    } catch (err) {
      const backendError = err.backendError;

      if (backendError) {
        const detailedMessages = (backendError.errors || [])
          .map((e) => frontendErrorMessage[e.code] || e.message)
          .filter(Boolean);

        setErrorMessages(detailedMessages);
        setErrorMessage(
          backendError.frontendErrorMessage
          || detailedMessages[0]
          || backendError.backendMessage
          || 'Llame a soporte',
        );

        return;
      }

      setErrorMessage('Llame a soporte');
    }
  };

  return (
    <form
      className="
        flex flex-col gap-8
        bg-white
        p-8
        rounded-xl
        shadow-lg
        w-full
        max-w-md
        mx-auto
      "
      onSubmit={handleSubmit(onValid)}
    >

      <Input
        label="Usuario"
        {...register('username', { required: 'Usuario es obligatorio' })}
        error={errors.username?.message}
      />

      <Input
        label="Email"
        {...register('email', { required: 'Email es obligatorio' })}
        error={errors.email?.message}
      />

      <Input
        label="Contraseña"
        type="password"
        {...register('password', { required: 'Contraseña obligatoria' })}
        error={errors.password?.message}
      />

      <Input
        label="Confirmar Contraseña"
        type="password"
        {...register('confirmPassword', {
          required: 'Confirmación obligatoria',
          validate: (v) => v === getValues('password') || 'Las contraseñas no coinciden',
        })}
        error={errors.confirmPassword?.message}
      />

      {!fixedRole && (
        <div className="flex flex-col gap-1">
          <label className="text-md font-medium text-gray-600">Rol</label>

          <select
            className="border rounded-lg p-2 text-gray-700"
            {...register('role', { required: 'El rol es obligatorio' })}
          >
            <option value="Client">Cliente</option>
            <option value="Admin">Admin</option>
          </select>

          {errors.role?.message && (
            <p className="text-red-500 text-sm">{errors.role.message}</p>
          )}
        </div>
      )}

      {errorMessage && (
        <p className="text-red-500 text-center text-sm">{errorMessage}</p>
      )}
      {errorMessages.length > 0 && (
        <ul className="text-red-500 text-sm list-disc list-inside space-y-1">
          {errorMessages.map((msg, idx) => (
            <li key={idx}>{msg}</li>
          ))}
        </ul>
      )}

      {/* Botón principal */}
      <Button type="submit">Registrarse</Button>

      {/*botón para volver al login */}
      {!onSuccess && (
        <Button type="button" onClick={() => navigate('/login')}>
          Iniciar Sesión
        </Button>
      )}

    </form>
  );
}

export default RegisterForm;
