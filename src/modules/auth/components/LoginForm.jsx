import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import useAuth from '../hook/useAuth';
import { frontendErrorMessage } from '../helpers/backendError';

function LoginForm({ onSuccess }) {
  const [errorMessage, setErrorMessage] = useState('');
  const [errorMessages, setErrorMessages] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { username: '', password: '' } });

  const navigate = useNavigate();
  const { singin } = useAuth();

  const onValid = async (formData) => {
    try {
      const { error } = await singin(formData.username, formData.password);

      if (error) {
        const detailedMessages = (error.errors || [])
          .map((err) => frontendErrorMessage[err.code] || err.message)
          .filter(Boolean);

        setErrorMessages(detailedMessages);
        setErrorMessage(
          error.frontendErrorMessage
          || detailedMessages[0]
          || error.backendMessage
          || 'Llame a soporte',
        );

        return;
      }

      // Si el form se está usando dentro de un modal
      if (onSuccess) return onSuccess();

      // Si no, navegación normal (admin)
      navigate('/admin/home');

    } catch (error) {
      const backendError = error.backendError;

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
      {/* Usuario */}
      <Input
        label="Usuario"
        {...register('username', { required: 'Usuario es obligatorio' })}
        error={errors.username?.message}
      />

      {/* Contraseña */}
      <Input
        label="Contraseña"
        {...register('password', { required: 'Contraseña es obligatorio' })}
        type="password"
        error={errors.password?.message}
      />

      {/* Botones */}
      <div className="flex flex-col gap-4">
        <Button type="submit">Iniciar Sesión</Button>

        {/* Solo mostrar el de registrar si NO es modal */}
        {!onSuccess && (
          <Button
            type="button"
            onClick={() => navigate('/register')}
            className="bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Registrarse
          </Button>
        )}
      </div>

      {errorMessage && (
        <p className="text-red-500 text-sm text-center">{errorMessage}</p>
      )}
      {errorMessages.length > 0 && (
        <ul className="text-red-500 text-sm list-disc list-inside space-y-1">
          {errorMessages.map((msg, idx) => (
            <li key={idx}>{msg}</li>
          ))}
        </ul>
      )}
    </form>
  );
}

export default LoginForm;
