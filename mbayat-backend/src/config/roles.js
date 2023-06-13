const allRoles = {
  user: [],
  admin: [],
  master_admin: [],
  admin_user: [],
  vendor: [],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
