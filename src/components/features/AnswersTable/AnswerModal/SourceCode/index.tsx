import { Fade } from "@mui/material";
import BackButton from "../BackButton";

interface SourceCodeProps {
  onBack: () => void;
}

const SourceCode = ({ onBack }: SourceCodeProps) => {
  return (
    <Fade in>
      <div>
        <BackButton label="Назад" onClick={onBack} />
        abobo
      </div>
    </Fade>
  );
};

export default SourceCode;
