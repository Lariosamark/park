import Permit from "../../components/dashboard/Permit";
import PermitForm from "../../components/dashboard/PermitForm";
import { useUser } from "../../providers/AuthProvider";
import LoadingPage from "../LoadingPage";
import { usePermit } from "./usePermit";
import { Container, Typography } from "@mui/material";
import { Link } from "react-router-dom"; // Import Link for navigation

export default function MyPermit() {
  const { user } = useUser();
  const { permit, loading } = usePermit(user.id);

  if (loading) return <LoadingPage />;
  if (!permit) return <PermitForm user={user} />;

  return (
    <Container>
      <Permit permitData={permit} />
      <Typography variant="h6" style={{ marginTop: '20px' }}>
        Need to renew your permit?
      </Typography>
      <Link to="/dashboard/RenewalPage" style={{ marginTop: '20px', display: 'block', color: '#1976d2', textDecoration: 'none', fontWeight: 'bold' }}>
        Renew Permit
      </Link>
    </Container>
  );
}
