import { useState } from "react";
import { instance } from "../../shared/api/axiosInstance";
import Button from "../../shared/components/Button";

function LoginModal({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const { data } = await instance.post("/api/auth/login", {
        email,
        password
      });

      localStorage.setItem("token", data.token);
      onSuccess();
    } catch (err) {
      alert("Credenciales inválidas");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-[350px]">
        <h2 className="text-xl mb-4">Iniciar sesión</h2>

        <input
          type="email"
          className="border p-2 w-full mb-3"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border p-2 w-full mb-4"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button className="w-full" onClick={login}>
          Ingresar
        </Button>
      </div>
    </div>
  );
}

export default LoginModal;
