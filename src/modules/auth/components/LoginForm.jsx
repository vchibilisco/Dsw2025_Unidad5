import { useForm } from 'react-hook-form';
import Input from './Input';
import Button from './Button';

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { username: '', password: '' } });

  const onValid = (data) => {
    console.log(data);
  };

  return (
    <form className='
        flex
        flex-col
        gap-4
        bg-white
        p-8
        sm:w-md
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
    </form>
  );
};

export default LoginForm;
