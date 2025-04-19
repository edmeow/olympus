import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import AdminService from "../../../services/AdminService";
import { useStore } from "../../../hooks/useStore";
import ResultsTable from "../../../components/DeprecatedUI/ResultsTable/ResultsTable";

const AdminResults = observer(() => {
  const { main } = useStore();

  const getUserResults = async () => {
    const res = await AdminService.getUserResults(main.contest.id);
    if (res.data) {
      main.setUserResults(res.data);
    }
  };

  useEffect(() => {
    getUserResults();
    
    const intervalId = setInterval(() => {
      getUserResults();
    }, 30000);

    return () => {
      clearInterval(intervalId);
      main.setUserResults({ users: [], tasksCount: 0 });
    };
  }, []);

  return (
    <div>
      <ResultsTable rows={main.userResults} />
    </div>
  );
});

export default AdminResults;
