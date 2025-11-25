function setActionRole(role){
    const roleAction = {
        1: ['create', 'read', 'update', 'delete'],
        2: ['create', 'read', 'update'],
        3: ['read']
    }
    
    return roleAction[role] || []
}

export default setActionRole