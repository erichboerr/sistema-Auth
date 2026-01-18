import { useState } from "react";
import { useAuth } from "../../../common/hooks/useAuth";
import { useToast } from "../../../common/hooks/useToast";
import { useNavigate } from "react-router-dom";

export const useLoginForm = () => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await login(user, password);

      // 🔹 Notificación de éxito
      addToast(`¡Bienvenido de nuevo, ${user}!`, "success");

      navigate("/dashboard");
    } catch (err) {
      console.error("Error en el login:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    user,
    setUser,
    password,
    setPassword,
    isSubmitting,
    handleSubmit,
    // El estado 'error' ahora lo maneja el Toast global
  };
};
