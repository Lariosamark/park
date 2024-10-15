import Permit from "../../components/dashboard/Permit";
import PermitForm from "../../components/dashboard/PermitForm";
import { useUser } from "../../providers/AuthProvider";
import LoadingPage from "../LoadingPage";
import { usePermit } from "./usePermit";

export default function MyPermit() {
  const { user } = useUser();
  const { permit, loading } = usePermit(user.id);

  if (loading) return <LoadingPage />;
  if (!permit) return <PermitForm user={user} />;

  return (
    <div>
      <Permit permitData={permit} />
    </div>
  );
}
