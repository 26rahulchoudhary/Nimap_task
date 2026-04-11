ROLE_PERMISSIONS = {
    "Admin": ["*"],
    "Analyst": ["upload", "edit"],
    "Auditor": ["review"],
    "Client": ["view"]
}

def has_permission(user_roles, action):
    for role in user_roles:
        permissions = ROLE_PERMISSIONS.get(role, [])
        if "*" in permissions or action in permissions:
            return True
    return False