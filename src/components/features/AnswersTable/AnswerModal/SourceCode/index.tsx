import { Box, CircularProgress, Fade, Grid, Typography } from "@mui/material";
import BackButton from "../BackButton";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { useMutation, useQuery } from "@tanstack/react-query";
import JudgeService from "../../../../../services/JudgeService";
import { useMemo, useState } from "react";
import { useTreeViewApiRef } from "@mui/x-tree-view";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import { SourceCodeProps } from "./interfaces";
import { getFileExtention, getTreeViewItems } from "./utils";

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
      setCode(hljs.highlight(data, { language }).value);
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
            apiRef={apiRef}
            items={treeViewItems}
            onItemClick={handleItemClick}
          />
        </Grid>
        <Grid
          size={8}
          overflow="auto"
          maxHeight="500px"
          fontSize="14px"
          bgcolor="rgb(31, 31, 31)"
          color="rgb(224, 224, 224)"
          p={1}
          borderRadius={1}
        >
          <pre style={{ margin: 0 }}>
            <code dangerouslySetInnerHTML={{ __html: code }}></code>
          </pre>
          {downloadFileAsPlainTextMutation.isPending && <CircularProgress />}
          {!code && (
            <Typography variant="body1" color="inherit">
              Выберите файл
            </Typography>
          )}
        </Grid>
      </Grid>
    </Fade>
  );
};

export default SourceCode;
