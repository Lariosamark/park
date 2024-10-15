import Permit from "../../components/dashboard/Permit";
import { createNotification } from "../../lib/notification";
import { updatePermit } from "../../lib/permit";
import { useUser } from "../../providers/AuthProvider";
import LoadingPage from "../LoadingPage";
import { usePermit } from "./usePermit";
import { useParams } from "react-router-dom";

export default function PermitPage() {
  const { permitId } = useParams();
  const { user } = useUser();

  const { permit, loading } = usePermit(permitId);

  if (loading) return <LoadingPage />;
  if (!permit) return <>No Permit</>;

  const handleUpdate = async (status) => {
    await updatePermit(permit.id, { status });
    await createNotification(
      user.id,
      permit.userId,
      `Admin ${status.toLowerCase()} your request`,
      { haha: "haha" }
    );
  };

  return (
    <div>
      <Permit permitData={permit} />
      <button
        className="bg-green-900 text-white px-4 py-2 rounded-md"
        onClick={() => handleUpdate("Approved")}
      >
        Approve
      </button>
      <button
        onClick={() => handleUpdate("Declined")}
        className="bg-red-900 text-white px-4 py-2 rounded-md"
      >
        Decline
      </button>
    </div>
  );
}
