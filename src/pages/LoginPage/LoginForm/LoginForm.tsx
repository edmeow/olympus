import { zodResolver } from "@hookform/resolvers/zod";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { AxiosError } from "axios";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ISignInRequest } from "../../../models/request/ISignInRequest";
import { signInSchema } from "../../../models/zodSchemas/signInSchema";
import AuthService from "../../../services/AuthService";
import "./loginForm.scss";
import { useStore } from "../../../hooks/useStore";

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ISignInRequest>({
    mode: "onBlur",
    resolver: zodResolver(signInSchema),
  });
  const { main } = useStore();
  const history = useNavigate();

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
    try {
      const response = await AuthService.login(
        dataFields.username,
        dataFields.password
      );

      const { accessToken, ...data } = response.data;
      main.setUser(data);
      localStorage.setItem("jwt", accessToken);
      main.setAuth(true);
      redirectToPage(main.user.role);
      reset();
    } catch (e: AxiosError | any) {
      if (e?.response?.status === 401) {
        setError("root", {
          type: "manual",
          message: "Ошибка неправильных данных при логине",
        });
      } else if (e?.request) {
        setError("root", {
          type: "manual",
          message: "Запрос был выполнен, но не получен ответ",
        });
      } else {
        console.log(1);
      }
    }
  };

  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
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
      <button disabled={!isValid || isSubmitting} className="formAuth__btn">
        {isSubmitting ? "Ожидание ответа" : "Войти"}
      </button>
    </form>
  );
};

export default observer(LoginForm);
