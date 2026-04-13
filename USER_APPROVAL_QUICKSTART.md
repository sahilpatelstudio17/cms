# User Approval Workflow - Quick Start Guide

## 🎯 What is this?

This is a **two-step user creation process**:
1. **Admin requests** to add a new user
2. **Admin or Super Admin approves/rejects** the request
3. **User is created** (or request is rejected)

---

## ✅ Step-by-Step: Add a New User

### Step 1: Open Users Page
- Click **Users** in the sidebar
- You should see existing users in a table

### Step 2: Click "Add User" Button
- Blue button at the top right
- Opens a modal/dialog window

### Step 3: Fill in User Details
```
Name:        John Doe
Email:       john@mycompany.com
Password:    SecurePass123
Role:        employee  (or other role)
Status:      active    (or inactive/pending)
```

### Step 4: Click "Add User" Button
- Form is submitted
- You'll see: ✅ "User request submitted for approval"
- Modal closes

### Step 5: Go to Approvals Page
- Click **Approvals** in sidebar
- Click **"Pending User Requests"** tab
- You'll see your new request in the list

### Step 6: Approve the Request
- Find the user you just added
- Click **green "Approve"** button
- User is now created! ✅

**Result:** The user can now login with their email and password!

---

## ✅ Step-by-Step: Reject a User Request

### Step 1: Go to Approvals
- Click **Approvals** in sidebar

### Step 2: Find the Pending Request
- Click **"Pending User Requests"** tab
- Find the user you want to reject

### Step 3: Click "Reject" Button
- Red button on the right
- Optionally add a reason
- Click confirm

**Result:** The request is rejected, no user account is created

---

## 📥 Bulk Import Users (Many at Once)

### Step 1: Click "Import Excel" Button
- On the Users page
- Next to "Add User" button

### Step 2: Download Template
- Click "📥 Download Template"
- Opens a CSV file on your computer

### Step 3: Edit the Template
Open in Excel or Google Sheets:
```
Name              | Email              | Role        | Status
John Smith        | john@company.com   | salesman    | active
Sarah Developer   | sarah@company.com  | developer   | active
Mike Manager      | mike@company.com   | manager     | pending
```

### Step 4: Save & Upload
- Save the file
- Come back to the Import dialog
- Click "Select file" or drag & drop
- Click **"Import Users"**

### Step 5: Approve Each Request
- Go to **Approvals** page
- You'll see a new **"Pending User Requests"** tab item
- Approve each user one by one

**Result:** All users are created! ✅

---

## 🔒 Role Types

Choose the appropriate role for each user:

| Role | Can Do | Use For |
|------|--------|---------|
| **employee** | View/submit own tasks, attendance, etc. | Regular employees |
| **manager** | Manage employees, approve tasks | Team leads |
| **admin** | Manage users, approvals, company settings | Admins |
| **salesman** | Create/manage sales records | Sales team |
| **developer** | View/create technical tasks | Dev team |
| **staff** | General staff member | Admin/office staff |
| **super_admin** | All permissions, approve admins | System admin only |

---

## 📊 User Status

When you create a user, choose their status:

| Status | Meaning | Can Login? |
|--------|---------|-----------|
| **active** | User can use the system | ✅ Yes, immediately |
| **inactive** | User exists but disabled | ❌ No |
| **pending** | Waiting for secondary approval | ❌ No (for now) |

---

## 🔍 View All Users

### On the Users Page:
- **Active users**: Green status badge
- **Inactive users**: Gray status badge  
- **Pending users**: Orange status badge
- **Rejected users**: Red status badge

### Edit a User:
- Click **"Edit"** button on any user
- Change name, email, role, or status
- Click **"Save Changes"**

### Delete a User:
- Click **"Delete"** button (only Super Admin)
- Confirm deletion
- User is removed from system

---

## ⏱️ Approval Workflow Timeline

```
10:00 AM - Admin clicks "Add User"
         ↓
10:01 AM - Request appears in "Pending User Requests"
         ↓
10:05 AM - Admin clicks "Approve"
         ↓
10:05 AM - ✅ User is created! Can now login
         ↓
10:06 AM - User receives email/notification to login
```

---

## ❌ Common Issues & Solutions

### "Email already in use" Error
**Problem:** The email you entered exists in another user request or is already a user
**Solution:** 
- Use a different email address
- Check if that email is already registered

### Can't find pending requests
**Problem:** Pending user requests disappeared
**Solution:** ✅ It's normal! They moved to "Approved" tab after you approved them
- Check the "Approved" or "Rejected" tabs in Approvals

### User can't login after creation
**Problem:** User was created but can't login
**Solution:** Check their status:
- Go to Users page
- Find the user
- Click Edit
- Change Status to "active" if it's "inactive" or "pending"
- Save changes

### Need to reject a user already approved?
**Problem:** You approved a user by mistake
**Solution:** 
1. Go to Users page
2. Find the user
3. Click Edit
4. Change Status to "inactive"
5. Save (user loses access)
6. Optional: Delete the user entirely (Super Admin only)

---

## 💡 Pro Tips

✅ **Set status to "active"** when you want the user to login immediately  
✅ **Set status to "inactive"** to temporarily disable a user  
✅ **Use bulk import** to add many users at once  
✅ **Keep a record** of who you approved (audit trail is automatic)  
✅ **Check Approvals tab regularly** to stay on top of new requests  

---

## 🆘 Need Help?

### Where to find information:
- **Full Workflow Details**: See `USER_APPROVAL_WORKFLOW.md`
- **API Details**: See `API_REFERENCE.md`
- **Setup Instructions**: See `README.md`

### Common Questions:
- Q: Can employees request their own accounts?
  - A: No, only admins can create user requests currently

- Q: Can I change a user's role after creation?
  - A: Yes, use the Edit button on the Users page

- Q: What happens to a rejected user request?
  - A: Nothing - they never get a user account. You can create a new request later.

- Q: Can I bulk delete users?
  - A: No, delete one at a time from the Users page

- Q: Is there an activity log?
  - A: Yes, each approval request tracks who approved it and when

---

## 📝 Checklist: Adding a New User

- [ ] Click "Users" in sidebar
- [ ] Click "+ Add User"
- [ ] Fill in all fields (name, email, password, role, status)
- [ ] Click "Add User" button
- [ ] Go to "Approvals" tab
- [ ] Find the pending request
- [ ] Click "Approve" button
- [ ] Confirm user was created
- [ ] New user can now login!

---

**Version**: 2.0  
**Last Updated**: April 10, 2026  
**Status**: Ready for Production ✅

