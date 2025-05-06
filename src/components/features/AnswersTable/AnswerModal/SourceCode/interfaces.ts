export interface SourceCodeProps {
  answerId: number;
  onBack: () => void;
}

export interface PreviewContentProps {
  code: string;
  loading: boolean;
}

export interface TreeItem {
  id: string;
  label: string;
  link?: string;
  children?: TreeItem[];
}
