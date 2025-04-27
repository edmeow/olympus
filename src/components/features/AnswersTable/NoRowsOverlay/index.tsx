import { EmtyIcon } from "../../../../utils/icons/EmtyIcon";

const NoRowsOverlay = () => {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        color: "rgb(143, 149, 158)",
        fontFamily: "Manrope",
        fontSize: "1rem",
        fontWeight: "700",
        lineHeight: "150%",
        letterSpacing: "0%",
        textAlign: "right",
      }}
    >
      <EmtyIcon />
      Нет данных
    </div>
  );
};

export default NoRowsOverlay;
