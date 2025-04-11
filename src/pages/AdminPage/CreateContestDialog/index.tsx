import {
  Alert,
  Autocomplete,
  Box,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormLabel,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { DEFAULT_PREFIX, GROUPS } from "./const";
import { useState } from "react";
import formatZodError from "../../../utils/formatZodError";

import { createContestSchema, groupSchema } from "./validate";
import {
  CreateContestDialogProps,
  CreateContestFormFields,
  Participant,
} from "./interfaces";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import AdminService from "../../../services/AdminService";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import dowloadBase64AsTxt from "../../../utils/downloadBase64";

const CreateContestDialog = ({ open, onClose }: CreateContestDialogProps) => {
  const {
    control,
    getValues,
    resetField,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<CreateContestFormFields>({
    mode: "onSubmit",
    resolver: zodResolver(createContestSchema),
    defaultValues: {
      name: "",
      judges: "",
      prefix: DEFAULT_PREFIX,
      duration: "",
      group: "",
      groupParticipantCount: "",
    },
  });
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [groups, setGroups] = useState<Participant[]>([]);

  const createContestMutation = useMutation({
    mutationFn: AdminService.createContest,
    onSuccess: (res) => {
      dowloadBase64AsTxt(res.data.fileContent, "Креды_для_участников.txt");
      navigate(`/admin/contest/${res.data.contest.id}`);
    },
    onError: (err) => {
      enqueueSnackbar({
        variant: "error",
        message: `Не удалось создать олимпиаду: ${err.message}`,
      });
    },
  });

  const participantsCount = groups.reduce((a, group) => a + group.count, 0);

  const addGroup = () => {
    try {
      const group = getValues("group");
      const count = getValues("groupParticipantCount");
      const participant = groupSchema.parse({ group, count });
      setGroups((prev) => prev.concat(participant));
      resetField("group");
      resetField("groupParticipantCount");
    } catch (err) {
      setError("root", formatZodError(err));
    }
  };

  const deleteGroup = (groupName: string) => {
    setGroups((prev) => prev.filter(({ group }) => group !== groupName));
  };

  const createOlym = (data: CreateContestFormFields) => {
    if (groups.length === 0) {
      return setError("root", { message: "Укажите количество участников" });
    }
    createContestMutation.mutate({
      name: data.name,
      participants: [...groups],
      judgeCount: parseInt(data.judges),
      usernamePrefix: data.prefix,
      duration: data.duration,
    });
  };

  const clearRootErrors = () => {
    clearErrors("root");
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      component="form"
      onSubmit={handleSubmit(createOlym)}
    >
      <DialogTitle>Создание олимпиады</DialogTitle>
      <DialogContent>
        <Stack width="432px" spacing={2} mt={1}>
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <Input
                {...field}
                ref={null}
                label="Название олимпиады"
                fullWidth
                error={Boolean(errors.name)}
                helperText={errors.name?.message}
                autoComplete="off"
              />
            )}
          />
          <FormLabel>Количество участников</FormLabel>
          <Stack spacing={1}>
            {groups.map(({ group, count }) => (
              <Chip
                key={group}
                label={`${group}, ${count} уч.`}
                onDelete={() => deleteGroup(group)}
              />
            ))}
            <Typography variant="caption" textAlign="center">
              Всего участников: {participantsCount}
            </Typography>
          </Stack>
          <Grid container spacing={1} alignItems="center" wrap="nowrap">
            <Grid size={5} onClick={clearRootErrors}>
              <Controller
                control={control}
                name="group"
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    onChange={(_, value) => field.onChange(value)}
                    size="small"
                    freeSolo
                    options={GROUPS}
                    renderInput={(params) => (
                      <Input {...params} ref={null} label="Классификация" />
                    )}
                  />
                )}
              />
            </Grid>
            <Grid size={4} onClick={clearRootErrors}>
              <Controller
                control={control}
                name="groupParticipantCount"
                render={({ field }) => (
                  <Input
                    {...field}
                    ref={null}
                    size="small"
                    label="Количество"
                    placeholder="1"
                    autoComplete="off"
                    type="number"
                  />
                )}
              />
            </Grid>
            <Grid>
              <Button onClick={addGroup}>Добавить</Button>
            </Grid>
          </Grid>
          <Controller
            control={control}
            name="judges"
            render={({ field }) => (
              <Input
                {...field}
                ref={null}
                label="Количество жюри"
                fullWidth
                autoComplete="off"
                placeholder="1"
                type="number"
                error={Boolean(errors.judges)}
                helperText={errors.judges?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="prefix"
            render={({ field }) => (
              <Input
                {...field}
                ref={null}
                label="Префикс олимпиады"
                fullWidth
                autoComplete="off"
                placeholder={DEFAULT_PREFIX}
                error={Boolean(errors.prefix)}
                helperText={errors.prefix?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="duration"
            render={({ field }) => (
              <Input
                {...field}
                ref={null}
                label="Длительность олимпиады"
                fullWidth
                autoComplete="off"
                placeholder="ЧЧ:ММ"
                error={Boolean(errors.duration)}
                helperText={errors.duration?.message}
              />
            )}
          />
          {errors.root && (
            <Box whiteSpace="break-spaces">
              <Alert variant="filled" severity="error">
                {errors.root.message}
              </Alert>
            </Box>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          type="submit"
          size="large"
          fullwidth
          disabled={createContestMutation.isPending}
        >
          Создать
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateContestDialog;
