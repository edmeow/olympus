import LoginForm from "./LoginForm/LoginForm";
import "./LoginPage.scss";
import Logo from "../../utils/icons/logo.svg";
import LoginBack from "../../utils/icons/login-form-bg-Image.png";

function LoginPage() {
  return (
    <div className="form-container">
      <img
        src={Logo}
        alt="Логотип платформы"
        className="form-container__logo"
      />
      <LoginForm />
      <img
        src={LoginBack}
        alt="Фоновое изображение"
        className="form-container__back"
      />
    </div>
  );
}

export default LoginPage;
