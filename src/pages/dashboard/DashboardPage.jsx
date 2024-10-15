import { useUser } from "../../providers/AuthProvider";

export default function DashboardPage() {
  const { user } = useUser();
  return (
    <div>
      DashboardPage
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
