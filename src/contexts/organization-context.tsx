import React, { createContext, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import OrganizationService, {
  Organization,
} from '../services/organization.service';

type OrganizationContextType = {
  organization: Organization | undefined;
  setOrganization: React.Dispatch<
    React.SetStateAction<Organization | undefined>
  >;
};

const OrganizationContext = createContext<OrganizationContextType | undefined>(
  undefined
);

function OrganizationProvider({ children }: { children: React.ReactNode }) {
  const { orgId } = useParams<{ orgId: string }>();
  const [organization, setOrganization] = useState<Organization>();

  useEffect(() => {
    if (orgId)
      OrganizationService.getOrganizationById(parseInt(orgId, 10)).then(
        setOrganization
      );
  }, [orgId]);

  return (
    <OrganizationContext.Provider value={{ organization, setOrganization }}>
      {children}
    </OrganizationContext.Provider>
  );
}

function useOrganization() {
  const context = useContext(OrganizationContext);

  if (context === undefined)
    throw new Error('useOrganization must be used within OrganizationProvider');

  return context;
}

export { OrganizationProvider, useOrganization };
