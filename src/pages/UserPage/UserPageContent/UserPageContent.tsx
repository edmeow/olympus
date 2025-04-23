import "./UserPageContent.scss";
import UserTask from "./UserTask/UserTask";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../hooks/useStore";
import UserTaskList from "./UserTaskList/UserTaskList";
import UserAnswersTable from "./UserAnswersTable/UserAnswersTable";
import UserResults from "./UserResults/UserResults";

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
