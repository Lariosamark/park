import Permit from "../../components/dashboard/Permit";
import { updatePermit } from "../../lib/permit";
import LoadingPage from "../LoadingPage";
import { usePermit } from "./usePermit";
import { useParams } from "react-router-dom";

export default function PermitPage() {
  const { permitId } = useParams();

  const { permit, loading } = usePermit(permitId);

  if (loading) return <LoadingPage />;
  if (!permit) return <>No Permit</>;

  return (
    <div>
      <Permit permitData={permit} />
      <button
        className="bg-green-900 text-white px-4 py-2 rounded-md"
        onClick={async () =>
          await updatePermit(permit.id, { status: "Approved" })
        }
      >
        Approve
      </button>
      <button
        onClick={async () =>
          await updatePermit(permit.id, { status: "Declined" })
        }
        className="bg-red-900 text-white px-4 py-2 rounded-md"
      >
        Decline
      </button>
    </div>
  );
}
