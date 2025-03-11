import { Role } from "../models/role.model";
import { PERMISSIONS } from "./permissions";

export const seedRoles = async () => {
  const roles = [
    { name: "admin", permissions: Object.values(PERMISSIONS) },
    { name: "client", permissions: [] },
  ];

  for (const role of roles) {
    const existingRole = await Role.findOne({ name: role.name });
    if (!existingRole) {
      await Role.create(role);
      console.log(`✅ Role created: ${role.name}`);
    }
  }
};
