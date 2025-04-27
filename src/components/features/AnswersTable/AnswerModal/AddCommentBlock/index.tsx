import ControlPointIcon from "@mui/icons-material/ControlPoint";
import {
  Box,
  Card,
  Collapse,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Input from "../../../../ui/Input";
import Button from "../../../../ui/Button";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../../../hooks/useStore";
import { useSnackbar } from "notistack";

interface AddCommentBlockProps {
  answerId: number;
  className: string;
}

const AddCommentBlock = ({ answerId, className }: AddCommentBlockProps) => {
  const { answers } = useStore();
  const { enqueueSnackbar } = useSnackbar();

  const [active, setActive] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const notes = answers.notes.get(answerId) || [];

  const toggle = () => {
    setValue("");
    setActive((prev) => !prev);
  };

  const save = () => {
    if (answers.notes.get(answerId)?.includes(value)) {
      enqueueSnackbar({
        variant: "error",
        message: "Заметка с таким содержанием уже существует",
      });
      return;
    }
    answers.addNote(answerId, value);
    toggle();
  };

  useEffect(() => {
    if (active && inputRef.current) {
      inputRef.current.focus();
    }
  }, [active]);

  return (
    <Box mt={4}>
      <Stack spacing={0.5}>
        {notes.map((note) => (
          <Card key={note}>
            <Box p="4px 8px" display="flex" justifyContent="space-between">
              <Typography variant="caption">{note}</Typography>
              <IconButton
                title="Удалить заметку"
                size="small"
                onClick={() => answers.removeNote(answerId, note)}
              >
                <CloseIcon sx={{ fontSize: 12 }} />
              </IconButton>
            </Box>
          </Card>
        ))}
      </Stack>
      <Stack
        className={className}
        direction="row"
        spacing={1}
        alignItems="center"
        onClick={toggle}
        mt={1}
      >
        <ControlPointIcon />
        <Typography variant="body1">Добавить заметку</Typography>
        <Typography variant="caption" color="text.secondary">
          (видна только вам)
        </Typography>
      </Stack>
      <Collapse in={active}>
        <Stack direction="row" spacing={1} mt={1}>
          <Input
            ref={inputRef}
            value={value}
            onInput={(e: ChangeEvent<HTMLInputElement>) =>
              setValue(e.target.value)
            }
            onKeyDown={(e) => e.code === "Enter" && save()}
            placeholder="Пишите здесь..."
            size="small"
            autoComplete="off"
          />
          <Button>Добавить</Button>
        </Stack>
      </Collapse>
    </Box>
  );
};

export default observer(AddCommentBlock);
