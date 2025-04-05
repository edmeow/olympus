import { zodResolver } from "@hookform/resolvers/zod";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { AxiosError } from "axios";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import AuthService from "../../../services/AuthService";
import { ISignInRequest } from "../../../models/request/ISignInRequest";
import { signInSchema } from "../../../models/zodSchemas/signInSchema";
import { useStore } from "../../../hooks/useStore";
import "./loginForm.scss";

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ISignInRequest>({
    mode: "onSubmit",
    resolver: zodResolver(signInSchema),
  });
  const { main } = useStore();
  const history = useNavigate();

  const loginMutation = useMutation({
    mutationFn: AuthService.login,
    onSuccess: (res) => {
      main.setUser(res.data);
      main.setAuth(true);
      redirectToPage(main.user.role);
    },
    onError: (err: AxiosError) => {
      if (err?.status === 400) {
        setError("root", {
          message: "Неверный логин или пароль",
        });
      } else {
        setError("root", {
          message: "Неизвестная ошибка",
        });
      }
    },
  });

  const [passwordShown, setPasswordShown] = useState(false);

  const redirectToPage = (role: string) => {
    switch (role) {
      case "ROLE_PARTICIPANT":
        history("/participant");
        break;
      case "ROLE_JUDGE":
        history("/judge");
        break;
      case "ROLE_ADMIN":
        history("/admin");
        break;
      default:
        break;
    }
  };

  const onSubmit = async (dataFields: ISignInRequest) => {
    loginMutation.mutate({
      username: dataFields.username,
      password: dataFields.password,
    });
  };

  const togglePasswordVisiblity = () => {
    setPasswordShown((prev) => !prev);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="formAuth">
      <h2 className="formAuth__welcome">Добро пожаловать</h2>
      <h1 className="formAuth__title">Вход</h1>
      <label className="formAuth__label">
        <p className="formAuth__label-text">Введите логин</p>
        <input
          {...register("username")}
          className="formAuth__input formAuth__input_login"
          placeholder="Введите имя пользователя"
          type="text"
        />
        {errors.username && (
          <p className="formAuth__input-error">{`${errors.username.message}`}</p>
        )}
      </label>
      <label className="formAuth__label">
        <p className="formAuth__label-text">Введите пароль</p>
        <div className="formAuth__password-container">
          <input
            {...register("password")}
            className="formAuth__input formAuth__input_password"
            placeholder="Введите пароль"
            type={passwordShown ? "text" : "password"}
          />
          {passwordShown ? (
            <VisibilityOffIcon
              onClick={togglePasswordVisiblity}
              aria-label="Hide password"
              className="formAuth__password-icon"
            />
          ) : (
            <VisibilityIcon
              onClick={togglePasswordVisiblity}
              aria-label="Show password"
              className="formAuth__password-icon"
            />
          )}
        </div>
        <p className="formAuth__input-error">
          {errors.password ? errors.password.message : ""}
        </p>
      </label>
      <p className="formAuth__error">{errors.root?.message}</p>
      <button disabled={loginMutation.isPending} className="formAuth__btn">
        Войти
      </button>
    </form>
  );
};

export default observer(LoginForm);
