export interface IFile {
  link: string;
  name: string;
}

export interface IFileTree {
  folderName: string;
  files: IFile[];
  folders: IFileTree[];
}
