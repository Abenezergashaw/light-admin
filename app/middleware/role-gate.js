// middleware/role-gate.js
export default defineNuxtRouteMiddleware((to, from) => {
  const { user } = useAuth();

  // 1. Check if user exists (is logged in)
  if (!user.value) {
    return navigateTo("/");
  }

  // 2. Get the required roles from the page's metadata
  // We use 'roles' as an array to allow multiple roles (e.g., Admin AND Agent)
  const allowedRoles = to.meta.roles;

  // 3. If the page has a role restriction, check the user's role
  if (allowedRoles && !allowedRoles.includes(user.value.role)) {
    console.log(`[ZemenBot] Access Denied for ${user.value.username}`);

    // Redirect unauthorized users to a safe page
    return navigateTo("/");
  }
});
