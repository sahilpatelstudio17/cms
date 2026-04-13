# User Approval Workflow Guide

## Overview
The CMS system has a complete **approval-based user creation workflow** that ensures admins can review and approve new user requests before they become active.

## Workflow Steps

### 1️⃣ **Admin Creates User Request**
- Admin navigates to **Users** page
- Clicks **"+ Add User"** button
- Fills in form with:
  - **Name**: User full name
  - **Email**: User email address
  - **Password**: Secure password (min 8 characters)
  - **Role**: User role (employee, manager, salesman, developer, staff, admin)
  - **Status**: Desired status (active, inactive, pending)
- Clicks **"Add User"** button

**Result:** User request is created with **"pending"** approval status, NOT a user account yet.

---

### 2️⃣ **View Pending User Requests**
Admins can view pending approval requests in two places:

#### Option A: **Approvals Page** (Recommended)
- Navigate to **Approvals** section
- Click **"Pending User Requests"** tab
- Shows all pending user creation requests with:
  - User name
  - User email  
  - Requested role
  - Request date

#### Option B: **Users Page**
- Shows all users (active, inactive, pending)
- Can see pending user status in the Users list

---

### 3️⃣ **Approve or Reject User Request**

#### To **Approve** a User:
1. Go to **Approvals** → **Pending User Requests** tab
2. Find the user request
3. Click the **green "Approve"** button
4. **Result:** 
   - User account is created in the users table with their requested status
   - An Employee record is automatically created for them
   - Approval request status changes to "approved"

#### To **Reject** a User:
1. Go to **Approvals** → **Pending User Requests** tab
2. Find the user request
3. Click the **red "Reject"** button
4. Optionally provide a reason/message
5. **Result:**
   - User request is rejected
   - No user account is created
   - Approval request status changes to "rejected"

---

### 4️⃣ **User Becomes Active**
After approval, the user:
- Can log in with their email and password
- Appears in the Users list with their requested status
- Has an Employee record created automatically
- Can use all system features based on their role

---

## Import Users from Excel

You can also bulk import multiple users at once:

### Steps:
1. Click **"📥 Import Excel"** button on Users page
2. Download the sample template (CSV format)
3. Edit the template with user details:
   ```
   Name | Email | Role | Status
   John Smith | john@company.com | salesman | active
   Sarah Dev | sarah@company.com | developer | pending
   ```
4. Select the file and click **"Import Users"**
5. Each imported user will:
   - Create an ApprovalRequest (pending)
   - Require admin approval before becoming a user

---

## User Statuses

| Status | Meaning | Can Login? |
|--------|---------|-----------|
| **active** | User is approved and can use the system | ✅ Yes |
| **inactive** | User account exists but is disabled | ❌ No |
| **pending** | Waiting for admin approval | ❌ No |
| **rejected** | Request was rejected, no account created | ❌ No |

---

## Database Flow

```
1. Admin submits "Add User" form
   ↓
2. ApprovalRequest created (status: pending, request_type: user)
   ↓
3. No User record yet
   ↓
4. Admin clicks "Approve"
   ↓
5. User record created (status: requested_status)
   ↓
6. Employee record created (for employee dropdown)
   ↓
7. ApprovalRequest marked as "approved"
   ↓
8. User can now log in
```

---

## Key Features

✅ **No premature user creation** - User accounts only created after approval  
✅ **Audit trail** - Tracks who requested and who approved  
✅ **Flexible status** - Can set users as active, inactive, or pending on creation  
✅ **Bulk import support** - Import multiple users at once with approval  
✅ **Role-based permissions** - Different roles automatically assigned  
✅ **Employee auto-creation** - Employees automatically appear in employee dropdown  

---

## Recent Fixes (v2.0)

### Bug Fix: User Status Now Properly Respected
- **Issue**: Status field from Add User form was ignored
- **Fix**: Now correctly stores and applies the requested status when approving users
- **Result**: Users are created with the admin's chosen status (active/inactive/pending)

---

## Troubleshooting

### User request shows but disappears after approval
✅ **This is normal** - Request moves from "Pending" tab to "Approved" once approved

### Can't find pending user requests
📍 Check different tabs:
- Admins: Check **Pending User Requests** or **User Registrations** tab
- Super Admin: Check **Admin Requests** tab (for admin user approvals)

### User was created but can't log in
🔍 Check the user status:
- If status is "pending" or "inactive" → User can't login
- Change status to "active" in Users page → Edit User → Change Status

### Email already exists error
⚠️ Email must be unique across the system
- Check if user already exists in active/inactive/pending users
- Use different email or delete the duplicate request

---

## Related Pages

- **Users Management**: Create/Edit/Delete users, view all users
- **Approvals**: Approve or reject pending requests (users, roles, employees, companies)  
- **Employees**: View and manage employee records (auto-created with users)
- **Dashboard**: System overview and statistics

