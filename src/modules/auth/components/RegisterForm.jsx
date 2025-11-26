import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import useAuth from '../hook/useAuth';

function RegisterForm({ onSuccess, fixedRole }) {
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm();

  const navigate = useNavigate();
  const { register: registerUser } = useAuth();

  const onValid = async ({ username, password, email, role }) => {
    setErrorMessage("");
    const finalRole = fixedRole ?? role;

    try {
      const { error } = await registerUser(username, password, email, finalRole);

      if (error) {
        setErrorMessage(error.frontendErrorMessage ?? "No se pudo completar el registro");
        return;
      }

      if (onSuccess) return onSuccess();

      navigate("/login");

    } catch {
      setErrorMessage("Llame a soporte");
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
        {...register("username", { required: "Usuario es obligatorio" })}
        error={errors.username?.message}
      />

      <Input
        label="Email"
        {...register("email", { required: "Email es obligatorio" })}
        error={errors.email?.message}
      />

      <Input
        label="Contraseña"
        type="password"
        {...register("password", { required: "Contraseña obligatoria" })}
        error={errors.password?.message}
      />

      <Input
        label="Confirmar Contraseña"
        type="password"
        {...register("confirmPassword", {
          required: "Confirmación obligatoria",
          validate: (v) => v === getValues("password") || "Las contraseñas no coinciden"
        })}
        error={errors.confirmPassword?.message}
      />

      {!fixedRole && (
        <div className="flex flex-col gap-1">
          <label className="text-md font-medium text-gray-600">Rol</label>

          <select
            className="border rounded-lg p-2 text-gray-700"
            {...register("role", { required: "El rol es obligatorio" })}
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

      {/* Botón principal */}
      <Button type="submit">Registrarse</Button>

      {/*botón para volver al login */}
      {!onSuccess && (
        <Button type="button" onClick={() => navigate("/login")}>
          Iniciar Sesión
        </Button>
      )}

    </form>
  );
}

export default RegisterForm;
