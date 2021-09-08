import { GroupFragment, CurrentUserFragment, GroupType } from "../generated/graphql";

export function getGroupName(group?: GroupFragment | null, me?: CurrentUserFragment | null) {
  if (group?.groupType === GroupType.Private) {
    const u = group.users?.filter((u) => u.id !== me?.id);
    return u?.length ? u[0].name : null;
  }

  return group?.name;
}
