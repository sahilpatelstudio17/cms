# User Management System - Complete Guide

## Features Implemented

### 1. **Admin Can Add Users** ✅
- Admins and Super Admins can create new users
- Assign roles during user creation
- Set initial status (active, inactive, pending)
- Default password: User@123 for imported users

### 2. **Role-Based Employee Management** ✅
Available roles:
- **admin** - Can manage users in their company
- **super_admin** - Can manage all users globally
- **manager** - Manager role for team leadership
- **salesman** - Sales representative role
- **developer** - Developer role
- **staff** - General staff role
- **employee** - Standard employee role

### 3. **Self-Role Protection** ✅
- Users cannot change their own role
- Edit modal shows warning: "⚠️ You cannot change your own role"
- Role selector is disabled when editing own profile
- Only admin/super_admin can change other users' roles

### 4. **Excel Import** ✅
- Import users in bulk from Excel/CSV files
- Required columns (in order):
  1. Name
  2. Email
  3. Role (must be one of the valid roles)
  4. Status (active, inactive, pending)

**File format example:**
```
Name          | Email                | Role      | Status
John Doe      | john@company.com     | manager   | active
Jane Smith    | jane@company.com     | salesman  | pending
Bob Developer | bob@company.com      | developer | active
Alice Staff   | alice@company.com    | staff     | inactive
```

## Frontend UI Components

### Users Page Features

#### 1. Add User Button
- Located in top-right corner
- Opens modal to create new user
- Requires: Name, Email, Password, Role, Status
- Only visible to admins/super_admins

#### 2. Import Excel Button
- Displays "📥 Import Excel" button
- Opens import modal with file uploader
- Shows required columns information
- Only visible to admins/super_admins

#### 3. User List Table
- Shows: Name, Email, Role (badge), Status (badge)
- Actions:
  - **Edit**: Change user details and role (with self-protection)
  - **Delete**: Only for super_admin

#### 4. Edit Modal
- Displays user information
- **Role field behavior:**
  - Normal users: Can change other users' roles
  - Own profile: Role dropdown is disabled with warning
  - Shows yellow warning box: "⚠️ You cannot change your own role"

#### 5. Import Modal
- File upload area (drag & drop or click)
- Supported formats: .xlsx, .xls, .csv
- Shows required columns guide
- Success feedback with count of imported/failed users

## Backend Endpoints

### Create User
```
POST /api/users
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@company.com",
  "password": "SecurePass123",
  "role": "manager",
  "status": "active"
}
```

### Update User
```
PUT /api/users/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@company.com",
  "role": "salesman",
  "status": "active"
}
```

### List Users
```
GET /api/users
Authorization: Bearer {token}

Returns:
{
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@company.com",
      "role": "manager",
      "status": "active",
      "company_id": 1,
      "created_at": "2026-04-08T..."
    },
    ...
  ]
}
```

### Bulk Import Users
```
POST /api/users/bulk-import
Authorization: Bearer {token}
Content-Type: multipart/form-data

FormData:
- file: <excel_file.xlsx>

Returns:
{
  "success_count": 3,
  "failed_count": 1,
  "results": [
    {
      "row_number": 2,
      "success": true,
      "user_data": {
        "name": "John Doe",
        "email": "john@company.com",
        "role": "manager",
        "status": "active"
      }
    },
    {
      "row_number": 3,
      "success": false,
      "error_msg": "email already exists in system"
    },
    ...
  ]
}
```

## Testing the System

### Test 1: Add a New User
1. Login as admin: company1@gmail.com / password123
2. Navigate to "Users" page
3. Click "+ Add User" button
4. Fill in details:
   - Name: John Manager
   - Email: john@company.com
   - Password: Test@123
   - Role: manager
   - Status: active
5. Click "Add User"
6. User appears in list ✓

### Test 2: Edit User Role
1. Click "Edit" on any user
2. Change role from "employee" to "developer"
3. Click "Save Changes"
4. Role updates in list ✓

### Test 3: Self-Role Protection
1. Click on your own profile
2. Try to change role
3. See warning: "⚠️ You cannot change your own role"
4. Role dropdown is disabled ✓

### Test 4: Bulk Import Users
1. Click "📥 Import Excel" button
2. Create Excel file with columns:
   - Name | Email | Role | Status
3. Add sample rows:
   - Jane Salesman | jane@company.com | salesman | active
   - Bob Developer | bob@company.com | developer | pending
4. Upload file
5. See success message: "2 users added, 0 failed"
6. Users appear in list ✓

### Test 5: Invalid Import Data
1. Create Excel with invalid role: "invalid_role"
2. Upload file
3. See error: "invalid role 'invalid_role'. Valid roles: admin, employee, ..."
4. Row marked as failed ✓

## File Structure

### Backend Files Updated
- `cmd/server/main.go` - Added UserImportService initialization
- `routes/routes.go` - Added /users/bulk-import endpoint
- `controllers/user_controller.go` - Added CreateUser method and role validation
- `controllers/bulk_import_controller.go` - Added ImportUsers method
- `services/user_import_service.go` - NEW: User import logic
- `models/user.go` - User model with role field

### Frontend Files Updated
- `views/dashboard/UsersView.vue` - Complete redesign with:
  - Add User modal
  - Excel import modal
  - Role selection with validation
  - Self-role protection
  - New action buttons

## Permissions Matrix

| Action | Admin | Super Admin | Employee | Manager | Salesman | Developer | Staff |
|--------|-------|------------|----------|---------|----------|-----------|-------|
| View Users | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Add User | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Edit User | ✓ (company) | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Delete User | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Import Users | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Change Own Role | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Change Other's Role | ✓ (company) | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |

## Notes

1. **Default Password for Import**: Users imported from Excel get default password "User@123"
2. **Email Uniqueness**: Email addresses must be unique across the system
3. **Company Isolation**: Admins can only see/manage users from their company. Super_admins see all users.
4. **Role Validation**: All 7 roles must be exactly as listed (lowercase)
5. **Status Values**: Only "active", "inactive", or "pending" are valid
6. **File Formats**: Excel (.xlsx, .xls) and CSV (.csv) are supported

## Known Limitations

- Portrait drag & drop for file import works but requires click fallback in some browsers
- Import shows results but doesn't prevent partial imports if some rows fail
- No duplicate email prevention during import (will be caught and reported)
- Password requirements not enforced (minimum 6 characters recommended)

## Future Enhancements

- [ ] Bulk edit multiple users at once
- [ ] Role templates for quick assignment
- [ ] Import history tracking
- [ ] Export users to Excel
- [ ] Schedule automated imports from file drops
- [ ] Role-based audit logging
- [ ] Password reset functionality
- [ ] User activation email

