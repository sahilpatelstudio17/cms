# User Management - Quick Start Guide

## System Overview

Your admin now has the power to:
1. ✅ Add new users with specific roles (manager, salesman, developer, staff, admin, employee, super_admin)
2. ✅ Prevent users from changing their own role
3. ✅ Bulk import users from Excel files
4. ✅ Manage all user roles and statuses

---

## Getting Started

### Start Server & Frontend

**Backend (Port 8082):**
```powershell
$env:DATABASE_URL='postgresql://postgres:new123@localhost:5432/cms_saas?sslmode=disable'
$env:APP_PORT='8082'
cd s:\cms\backend
go run cmd/server/main.go
```

**Frontend (Port 5174):**
```powershell
cd s:\cms\frontend
npm run dev
```

---

## Test Scenario 1: Add a User with Manager Role

### Steps:
1. Go to http://localhost:5174
2. Login:
   - Email: `company1@gmail.com`
   - Password: `password123`
3. Click **Users** in sidebar
4. Click **+ Add User** button (top-right)
5. Fill in form:
   - Name: `John Manager`
   - Email: `john.manager@company.com`
   - Password: `SecurePass123`
   - Role: `manager` ← Select from dropdown
   - Status: `active`
6. Click **Add User**
7. ✅ User appears in the list with `manager` badge

### Expected Result:
```
User List:
└─ John Manager (john.manager@company.com) [manager badge] [active badge]
```

---

## Test Scenario 2: Self-Role Protection

### Steps:
1. In Users list, click **Edit** on your own profile (company1@gmail.com)
2. Notice the yellow warning box:
   ```
   ⚠️ You cannot change your own role
   ```
3. Try to change the Role dropdown → **It's disabled** (grayed out)
4. Other fields (Name, Email, Status) still work
5. Click **Cancel** to close

### Expected Result:
- Role field is disabled/grayed out
- Yellow warning banner shows
- No way to change your own role

---

## Test Scenario 3: Bulk Import from Excel

### Step 1: Create Excel File

Create a file named `users_import.xlsx` with these columns:

| Name | Email | Role | Status |
|------|-------|------|--------|
| Jane Salesman | jane.salesman@company.com | salesman | active |
| Bob Developer | bob.dev@company.com | developer | pending |
| Alice Staff | alice@company.com | staff | active |
| Mike Admin | mike.admin@company.com | admin | active |

**Save as:** `users_import.xlsx`

### Step 2: Upload File

1. In Users page, click **📥 Import Excel** (top-right button)
2. See modal with required columns info:
   ```
   Required columns (in order):
   1. Name
   2. Email
   3. Role (admin, employee, super_admin, manager, salesman, developer, staff)
   4. Status (active, inactive, pending)
   ```
3. Click on dashed box or select file:
   - Browse and select `users_import.xlsx`
   - Or drag & drop the file
4. File name appears: `✓ users_import.xlsx`
5. Click **Import Users**

### Step 3: View Results

Should see success message:
```
✅ Import Complete
4 users added, 0 failed
```

Users now appear in list:
```
- Jane Salesman [salesman badge] [active badge]
- Bob Developer [developer badge] [pending badge]
- Alice Staff [staff badge] [active badge]
- Mike Admin [admin badge] [active badge]
```

---

## Test Scenario 4: Handle Import Errors

### Steps:
1. Create Excel with intentional errors:

| Name | Email | Role | Status |
|------|-------|------|--------|
| Valid User | valid@company.com | developer | active |
| Missing Email | | salesman | active |
| Invalid Role | bad@company.com | invalid_role | active |
| Duplicate Email | company1@gmail.com | manager | active |

2. Click **📥 Import Excel**
3. Upload this file
4. See result:
   ```
   ⚠️ Import Complete
   1 users added, 3 failed
   ```

Errors logged to browser console:
```
Row 3: missing required columns
Row 4: invalid role 'invalid_role'
Row 5: email already exists in system
```

---

## Test Scenario 5: Edit Existing User's Role

### Steps:
1. In Users list, find a user with `employee` role
2. Click **Edit** button
3. No warning banner appears (it's not your own profile)
4. Change Role from `employee` → `salesman`
5. Change Status from `active` → `inactive`
6. Click **Save Changes**
7. ✅ User updates in list with new role

### Expected Result:
```
Before: Name [employee badge] [active badge]
After:  Name [salesman badge] [inactive badge]
```

---

## Available Roles

When adding users or importing, you can assign:

| Role | Purpose |
|------|---------|
| **admin** | Company administrator - manage company users |
| **super_admin** | System administrator - manage all users globally |
| **manager** | Team manager role |
| **salesman** | Sales representative role |
| **developer** | Developer/engineering role |
| **staff** | General staff member |
| **employee** | Standard employee role |

---

## File Import Format

### Excel File Requirements:
- **Format**: .xlsx or .xls
- **Sheet**: First sheet will be used
- **Columns** (must be in this order):
  1. Name (2-120 characters)
  2. Email (must be valid email format)
  3. Role (one of the 7 valid roles)
  4. Status (active, inactive, or pending)

### CSV File Requirements:
- **Format**: .csv with comma separator
- **Same columns** as Excel format
- Row 1 is treated as header if it looks like column names

### Default Password:
- When importing users, default password is: **User@123**
- Users should change this on first login

---

## Common Issues & Solutions

### Issue: "email already exists in system"
- **Cause**: User with that email already in system
- **Solution**: Use unique email or update existing user

### Issue: "invalid role 'xyz'"
- **Cause**: Role name spelling/case mismatch
- **Solution**: Use exact role names (lowercase): admin, employee, super_admin, manager, salesman, developer, staff

### Issue: "missing required columns"
- **Cause**: File missing Name, Email, Role, or Status column
- **Solution**: Check Excel has all 4 columns in correct order

### Issue: Role dropdown disabled on edit
- **Cause**: You're editing your own profile
- **Solution**: This is by design - you cannot change your own role. Have another admin update if needed.

### Issue: Cannot see Add User or Import buttons
- **Cause**: Your role is not admin or super_admin
- **Solution**: Login as admin@company.com or request admin access

---

## Testing Checklist

- [ ] Can login as company1@gmail.com
- [ ] Can navigate to Users page
- [ ] Can see + Add User button
- [ ] Can see 📥 Import Excel button
- [ ] Can add new user with manager role
- [ ] Can edit another user's role
- [ ] Cannot change your own role (warning appears)
- [ ] Can import Excel file successfully
- [ ] Import shows success count and failed count
- [ ] Imported users appear in list
- [ ] User roles display correctly (badges)
- [ ] Status badges show active/inactive correctly

---

## API Testing (Optional)

If you want to test the backend API directly:

### Add User via API:
```bash
curl -X POST http://localhost:8082/api/users \
  -H "Authorization: Bearer {your_jwt_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Developer",
    "email": "jane.dev@company.com",
    "password": "Test@123",
    "role": "developer",
    "status": "active"
  }'
```

### Import Users via API:
```bash
curl -X POST http://localhost:8082/api/users/bulk-import \
  -H "Authorization: Bearer {your_jwt_token}" \
  -F "file=@users_import.xlsx"
```

---

## Next Steps

After testing user management:
1. ✅ Create test users with different roles
2. ✅ Assign them to tasks/approvals
3. ✅ Set up role-based task assignments
4. ✅ Configure approval workflows

---

**Questions?** See `USER_MANAGEMENT_GUIDE.md` for detailed documentation.
