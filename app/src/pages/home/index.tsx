import { Breadcrumb, BreadcrumbItem, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import AppShell from "~/components/nav/AppShell";
import PageHeaderContainer from "~/components/nav/PageHeaderContainer";
import ProjectBreadcrumbContents from "~/components/nav/ProjectBreadcrumbContents";
import { api } from "~/utils/api";
import { useHandledAsyncCallback, useSelectedOrg } from "~/utils/hooks";

export default function HomePage() {
  const utils = api.useContext();
  const { data: selectedOrg } = useSelectedOrg();

  const updateMutation = api.organizations.update.useMutation();
  const [onSaveName] = useHandledAsyncCallback(async () => {
    if (name && name !== selectedOrg?.name && selectedOrg?.id) {
      await updateMutation.mutateAsync({
        id: selectedOrg.id,
        updates: { name },
      });
      await Promise.all([utils.organizations.get.invalidate({ id: selectedOrg.id })]);
    }
  }, [updateMutation, selectedOrg]);

  const [name, setName] = useState(selectedOrg?.name);
  useEffect(() => {
    setName(selectedOrg?.name);
  }, [selectedOrg?.name]);
  return (
    <AppShell>
      <PageHeaderContainer>
        <Breadcrumb>
          <BreadcrumbItem>
            <ProjectBreadcrumbContents />
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <Text>Home</Text>
          </BreadcrumbItem>
        </Breadcrumb>
      </PageHeaderContainer>
    </AppShell>
  );
}
