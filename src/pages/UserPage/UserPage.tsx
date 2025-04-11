import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ParticipantService from "../../services/ParticipantService";
import { IContest } from "../../models/IContest";
import UserPageContent from "../../components/User/UserPageContent/UserPageContent";
import "./UserPage.scss";
import { observer } from "mobx-react-lite";
import { useStore } from "../../hooks/useStore";

const UserPage: FC = () => {
  const { main } = useStore();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const history = useNavigate();

  useEffect(() => {
    async function getContest() {
      try {
        const res = await ParticipantService.getContest<IContest>();
        if (res?.data) {
          main.setContest(res.data);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error.code === "ERR_BAD_RESPONSE") {
          await getContest();
        } else {
          console.log(error);
        }
      } finally {
        setIsLoading(false);
      }
    }
    if (!main.user.email && !main.user.name && !main.user.surname) {
      history("/add-personal-data");
    }
    getContest();
  }, []);

  if (isLoading) {
    return <div>Ожидайте</div>;
  }

  return (
    <div className="userPage">
      <UserPageContent />
    </div>
  );
};

export default observer(UserPage);
