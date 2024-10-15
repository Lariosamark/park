import React from "react";
import PermitForm from "../../components/dashboard/PermitForm";

export default function MyPermit() {
  const { user } = useUser();
  return (
    <div>
      <PermitForm />
    </div>
  );
}
