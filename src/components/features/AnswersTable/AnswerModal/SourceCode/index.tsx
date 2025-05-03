import { Box, CircularProgress, Fade, Grid, Typography } from "@mui/material";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import BackButton from "../BackButton";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { useMutation, useQuery } from "@tanstack/react-query";
import JudgeService from "../../../../../services/JudgeService";
import { useMemo, useState } from "react";
import { useTreeViewApiRef } from "@mui/x-tree-view";
import hljs from "highlight.js";
import "highlight.js/styles/vs2015.min.css";
import { SourceCodeProps } from "./interfaces";
import {
  getFileExtention,
  getPrettyPrintJson,
  getTreeViewItems,
} from "./utils";
import "./styles.scss";
import { cn } from "@bem-react/classname";

const cnSourceCode = cn("SourceCode");

const SourceCode = ({ answerId, onBack }: SourceCodeProps) => {
  const apiRef = useTreeViewApiRef();

  const [code, setCode] = useState("");

  const { data: filesTree, isLoading } = useQuery({
    queryKey: ["files-tree", answerId],
    queryFn: () => JudgeService.getFilesTree(answerId),
  });

  const downloadFileAsPlainTextMutation = useMutation({
    mutationFn: JudgeService.downloadFileAsPlainText,
    onSuccess: ({ data, request }) => {
      const language = getFileExtention(request.responseURL);
      if (language === "json") {
        setCode(hljs.highlight(getPrettyPrintJson(data), { language }).value);
      } else {
        setCode(hljs.highlight(data, { language }).value);
      }
    },
    onError: (err) => {
      console.error("Error fetching the resource:", err);
      setCode(
        hljs.highlight("Просмотр файла недоступен", { language: "plaintext" })
          .value
      );
    },
  });

  const treeViewItems = useMemo(
    () => getTreeViewItems(filesTree?.data),
    [filesTree]
  );

  const handleItemClick = async (_: unknown, itemId: string) => {
    const item = apiRef.current?.getItem(itemId);
    if (item && item.link) {
      downloadFileAsPlainTextMutation.mutate(item.link);
    }
  };

  if (isLoading) return <CircularProgress />;

  return (
    <Fade in>
      <Grid container spacing={4}>
        <Grid size={4}>
          <BackButton label="Назад" onClick={onBack} />
          <Box height="8px" />
          <RichTreeView
            className={cnSourceCode()}
            apiRef={apiRef}
            items={treeViewItems}
            onItemClick={handleItemClick}
          />
        </Grid>
        <Grid size={8}>
          <pre style={{ margin: 0 }} className={cnSourceCode("preview")}>
            <code dangerouslySetInnerHTML={{ __html: code }}></code>
          </pre>
          {downloadFileAsPlainTextMutation.isPending && <CircularProgress />}
          {!code && (
            <div className={cnSourceCode("overlay")}>
              <FileOpenIcon />
              <Typography variant="body1" color="inherit">
                Выберите файл
              </Typography>
            </div>
          )}
        </Grid>
      </Grid>
    </Fade>
  );
};

export default SourceCode;
