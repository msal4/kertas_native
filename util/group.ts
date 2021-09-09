import { GroupFragment, CurrentUserFragment, GroupType } from "../generated/graphql";

interface GroupInfo {
  name: string;
  image: string;
}

export function getGroupInfo(group?: GroupFragment | null, me?: CurrentUserFragment | null): GroupInfo | null {
  if (group?.groupType === GroupType.Private) {
    const u = group.users?.filter((u) => u.id !== me?.id);

    return u?.length ? { name: u[0].name, image: u[0].image } : null;
  }

  return {
    name: group?.name ?? "",
    image: "",
  };
}
