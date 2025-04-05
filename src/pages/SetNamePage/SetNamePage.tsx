import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { IAddPersonalDataRequest } from "../../models/request/IAddPersonalDataRequest";
import { addPersonalSchema } from "../../models/zodSchemas/addPersonalSchema";
import ParticipantService from "../../services/ParticipantService";
import "./SetNamePage.scss";
import { useStore } from "../../hooks/useStore";

const SetNamePage: React.FC = () => {
  const { main } = useStore();
  const history = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isValid },
  } = useForm<IAddPersonalDataRequest>({
    mode: "onBlur",
    resolver: zodResolver(addPersonalSchema),
  });

  const onSubmit = async (dataFields: IAddPersonalDataRequest) => {
    try {
      const response = await ParticipantService.addPersonalData(
        dataFields.name,
        dataFields.surname,
        dataFields.email,
        main.user.username
      );

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { accessToken, ...data } = response.data;

      main.setUser(data);

      history("/participant");
      reset();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    } catch (e: AxiosError | any) {
      setError("root", {
        type: "manual",
        message: "Невалидные данные в форме",
      });
    }
  };
  
  useEffect(() => {
    if (main.user.email && main.user.surname && main.user.name) {
      history('/participant');
    }
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="formAuthUser">
        <h1 className="formAuthUser__title">Введите персональные данные</h1>
        <label className="formAuthUser__label">
          Введите свое имя
          <input
            {...register("name")}
            className="formAuthUser__input formAuthUser__input_login"
            placeholder="Иван"
          ></input>
          {errors.name && (
            <p className="formAuthUser__input-error">{`${errors.name.message}`}</p>
          )}
        </label>
        <label className="formAuthUser__label">
          Введите свою фамилию
          <input
            {...register("surname")}
            placeholder="Иванов"
            className="formAuthUser__input formAuthUser__input_login"
          ></input>
          {errors.surname && (
            <p className="formAuthUser__input-error">{`${errors.surname.message}`}</p>
          )}
        </label>
        <label className="formAuthUser__label">
          Введите свою почту
          <input
            {...register("email")}
            placeholder="email@mail.ru"
            className="formAuthUser__input formAuthUser__input_login"
          ></input>
          {errors.email && (
            <p className="formAuthUser__input-error">{`${errors.email.message}`}</p>
          )}
        </label>
        <p className="formAuthUser__error">{errors.root?.message}</p>
        <button
          disabled={!isValid || isSubmitting}
          className="formAuthUser__btn"
        >
          {isSubmitting ? "Ожидание ответа" : "Запомнить"}
        </button>
      </form>
    </div>
  );
};

export default SetNamePage;
