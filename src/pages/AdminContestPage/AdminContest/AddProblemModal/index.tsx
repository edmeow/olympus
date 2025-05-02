import {
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import DialogCloseButton from "../../../../components/ui/DialogCloseButton";
import Button from "../../../../components/ui/Button";
import { Controller, useForm } from "react-hook-form";
import "./styles.scss";
import Input from "../../../../components/ui/Input";
import { ChangeEvent } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProblemSchema } from "./validate";
import { useMutation } from "@tanstack/react-query";
import AdminService from "../../../../services/AdminService";
import { enqueueSnackbar } from "notistack";
import ITask from "../../../../models/ITask";

interface AddProblemModalProps {
  contestId: number;
  open: boolean;
  onClose: () => void;
  onTasksUpdate: (tasks: ITask[]) => void;
}

interface AddProblemModalFormField {
  name: string;
  points: string;
  pdf?: File;
  addition?: File;
  test?: File;
}

const AddProblemModal = ({ contestId, open, onClose, onTasksUpdate }: AddProblemModalProps) => {
  const {
    control,
    watch,
    setValue,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm<AddProblemModalFormField>({
    mode: "onSubmit",
    resolver: zodResolver(createProblemSchema),
    defaultValues: {
      name: "",
      points: "",
    },
  });

  const createProblemMutation = useMutation({
    mutationFn: AdminService.addProblem,
    onSuccess: (res) => {
      onTasksUpdate(res.data);
      handleClose();
    },
    onError: (err) => {
      enqueueSnackbar({
        variant: "error",
        message: `Не удалось создать задание: ${err.message}`,
      });
    },
  });

  const pdf = watch("pdf");
  const addition = watch("addition");
  const test = watch("test");

  const createProblem = async (data: AddProblemModalFormField) => {
    createProblemMutation.mutate({
      contestId,
      points: parseFloat(data.points),
      name: data.name,
      pdf: data.pdf || null,
      addition: data.addition || null,
      test: data.test || null,
    });
  };

  const handlePdfChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("pdf", file);
    }
  };

  const handleAdditionChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("addition", file);
    }
  };

  const handleTestChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("test", file);
    }
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      component="form"
      onSubmit={handleSubmit(createProblem)}
      className="form-add-problem"
    >
      <DialogTitle>Новое задание</DialogTitle>
      <DialogCloseButton onClose={handleClose} />
      <DialogContent>
        <Stack width="432px" spacing={2}>
          <Controller
            control={control}
            name="name"
            render={({ field, fieldState: { error } }) => (
              <Input
                {...field}
                ref={null}
                label="Название"
                size="small"
                fullWidth
                error={Boolean(error)}
                helperText={error?.message}
                autoComplete="off"
              />
            )}
          />
          <Controller
            control={control}
            name="points"
            render={({ field, fieldState: { error } }) => (
              <Input
                {...field}
                ref={null}
                label="Количество баллов за задание"
                size="small"
                fullWidth
                error={Boolean(error)}
                helperText={error?.message}
                placeholder="100"
                autoComplete="off"
              />
            )}
          />
          <label className="form-add-problem__file-input">
            <span>Задание в формате PDF</span>
            <input type="file" accept=".pdf" onChange={handlePdfChange} />
            {pdf && (
              <span className="form-add-problem__helper-text">{pdf.name}</span>
            )}
          </label>
          <label className="form-add-problem__file-input">
            <span>Дополнительные материалы</span>
            <input type="file" onChange={handleAdditionChange} />
            {addition && (
              <span className="form-add-problem__helper-text">
                {addition.name}
              </span>
            )}
          </label>
          <div>
            <label className="form-add-problem__file-input">
              <span>Автотесты</span>
              <input
                type="file"
                accept=".js, .ts"
                onChange={handleTestChange}
              />
              {test && (
                <span className="form-add-problem__helper-text">
                  {test.name}
                </span>
              )}
            </label>
            <p className="form-add-problem__additional-info">
              <a href="#">Подробнее о том, как писать автотесты для заданий</a>
            </p>
          </div>
          {errors.pdf && (
            <Alert variant="filled" severity="error">
              {errors.pdf.message}
            </Alert>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          type="submit"
          size="large"
          fullwidth
          disabled={createProblemMutation.isPending}
        >
          Создать
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProblemModal;
