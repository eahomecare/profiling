

export function hasPermission(userPermissions, permissionName) {
    return userPermissions.some(
        (permission) => permission.name === permissionName,
    );
}