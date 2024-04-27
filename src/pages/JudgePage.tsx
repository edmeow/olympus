import { FC } from "react";
import { useParams } from "react-router-dom";

const JudgePage: FC = () => {
    const { sessionId } = useParams();
    return <div>
        <h2>Judge Page</h2>
    <p>Session ID: {sessionId}</p>
    </div>
}

export default JudgePage