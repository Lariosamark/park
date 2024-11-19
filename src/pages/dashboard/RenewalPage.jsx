import PermitRenewalForm from "../../components/dashboard/PermitRenewalForm";
import { useUser } from "../../providers/AuthProvider";

export default function RenewalPage() {

  const {user} = useUser()

  return (
    <main>
      <PermitRenewalForm user={user} />
    </main>
  );
}
