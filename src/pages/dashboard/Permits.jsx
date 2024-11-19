import { usePermits } from "./usePermit";
import { PermitsTable } from "../../components/dashboard/PermitsTable";

export default function Permits() {
  const { permits } = usePermits("Pending");
  return (
    <div>
      <h1 className="text-xl mb-2">Permits</h1>
      <PermitsTable permits={permits} />
    </div>
  );
}
