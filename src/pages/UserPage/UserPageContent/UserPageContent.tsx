import "./UserPageContent.scss";
import UserTaskList from "../../../components/User/UserTaskList/UserTaskList";
import UserTask from "../../../components/User/UserTask/UserTask";
import { observer } from "mobx-react-lite";
import UserAnswersTable from "../../../components/User/UserAnswersTable/UserAnswersTable";
import UserResults from "../../../components/User/UserResults/UserResults";
import { useStore } from "../../../hooks/useStore";

const UserPageContent: React.FC = () => {
  const { main } = useStore();

  return (
    <div className="userPageContent">
      {main.selectedViewContent === "tasks" && (
        <div className="userPageContent__main">
          <div style={{ display: "flex" }}>
            <UserTaskList />
            <UserTask />
          </div>
          <UserAnswersTable />
        </div>
      )}
      {main.selectedViewContent === "results" && (
        <div>
          <UserResults userGroup={main.user.group} userId={main.user.id} />
        </div>
      )}
    </div>
  );
};

export default observer(UserPageContent);
