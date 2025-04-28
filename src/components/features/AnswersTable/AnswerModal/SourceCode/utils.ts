import { IFileTree } from "../../../../../models/IFile";
import { TreeItem } from "./interfaces";

export const getTreeViewItems = (root?: IFileTree) => {
  if (!root) return [];
  
  let idCount = 0;

  const convertToTreeItem = (folder: IFileTree) => {
    const treeItem: TreeItem = {
      id: (idCount++).toString(),
      label: folder.folderName || "root",
      children: [],
    };

    // Add folders first
    folder.folders.forEach((subFolder) => {
      treeItem.children?.push(convertToTreeItem(subFolder));
    });

    // Add files after folders
    folder.files.forEach((file) => {
      treeItem.children?.push({
        id: (idCount++).toString(),
        label: file.name,
        link: file.link,
      });
    });

    return treeItem;
  };

  return convertToTreeItem(root)?.children || [];
};

export const getFileExtention = (link?: string) => link?.split(".").pop() || "plaintext";
