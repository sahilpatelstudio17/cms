# User Approval Workflow - Visual Flow Diagram

## 📊 Complete Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    ADMIN USER INTERFACE                          │
│                                                                  │
│  [Users Page]           [Approvals Page]                         │
│  - View all users       - Pending requests tabs               │
│  - Add User button      - Approve/Reject buttons             │
│  - Import Excel button  - Request details                    │
└─────────────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────────────┐
│              BACKEND - APPROVAL REQUEST CREATION                 │
│                                                                  │
│  POST /api/approvals/user/request                              │
│  ├─ Check email not duplicate                                 │
│  ├─ Hash password                                             │
│  └─ Create ApprovalRequest                                   │
│      ├─ RequestType: "user"                                  │
│      ├─ Status: "pending"                                    │
│      ├─ RequestedRole: (from form)                           │
│      └─ RequestedStatus: (from form) ✅ NEW!                 │
└─────────────────────────────────────────────────────────────────┘
              ↓
     ┌────────────────────┐
     │ ApprovalRequest    │
     │ Status: pending    │
     │ User: NOT CREATED  │
     └────────────────────┘
              ↓
┌─────────────────────────────────────────────────────────────────┐
│           ADMIN REVIEWS IN APPROVALS PAGE                        │
│                                                                  │
│  GET /api/approvals/user/pending                               │
│  ├─ Fetch all pending requests for company                    │
│  └─ Display in "Pending User Requests" tab                   │
│                                                                  │
│  Admin sees:                                                   │
│  - User name: John Doe                                        │
│  - Email: john@company.com                                    │
│  - Role: employee                                             │
│  - [Approve Button]  [Reject Button]                          │
└─────────────────────────────────────────────────────────────────┘
              ↓
     ┌─────────────────────────────────────────┐
     │         ADMIN DECISION                   │
     │                                          │
     │  Option A: APPROVE  Option B: REJECT     │
     └─────────────────────────────────────────┘
              ↙              ↘
     APPROVE FLOW          REJECT FLOW             
        ↓                      ↓
┌──────────────────┐   ┌──────────────────┐
│ POST /approve    │   │ POST /reject     │
│ Create User ✅   │   │ Mark rejected    │
└──────────────────┘   └──────────────────┘
        ↓                      ↓
    User created in users  Status: rejected
    Status: (requested)    No user created
    Role: (assigned)       Request marked done
    Password: (hashed)           ↓
    CompanyID: (set)        DATABASE UPDATED
        ↓
    Employee created
    (auto-generated)
        ↓
    ApprovalRequest
    Status: approved
        ↓
    DATABASE UPDATED
        ↓
    ✅ USER NOW EXISTS!
       Can login with email/password
```

---

## 🔄 State Transition Diagram

```
┌─────────────────────┐
│  Approval Request   │
│   Created (pending) │
└─────────────────────┘
          │
          ├──── APPROVE ────► ┌──────────────────┐
          │                   │  User Created ✅  │
          │                   │  Status: active   │
          │                   └──────────────────┘
          │
          └──── REJECT ─────► ┌──────────────────┐
                              │  Request Rejected │
                              │  No User Created  │
                              └──────────────────┘
```

---

## 📋 Data Flow: "Add User" Form

```
┌────────────────────────────────────┐
│  Admin fills "Add User" form:      │
│  ✓ Name: John Doe                  │
│  ✓ Email: john@company.com         │
│  ✓ Password: SecurePass123         │
│  ✓ Role: employee                  │
│  ✓ Status: active  ← KEY FIELD!    │
└────────────────────────────────────┘
          ↓
┌────────────────────────────────────┐
│  Frontend sends JSON:              │
│  {                                 │
│    "name": "John Doe",             │
│    "email": "john@...",            │
│    "password": "...",              │
│    "role": "employee",             │
│    "status": "active"  ← SENT!     │
│  }                                 │
└────────────────────────────────────┘
          ↓
┌────────────────────────────────────┐
│  Backend stores in DB:             │
│  ApprovalRequest {                 │
│    requestType: "user",            │
│    adminName: "John Doe",          │
│    adminEmail: "john@...",         │
│    requestedRole: "employee",      │
│    requestedStatus: "active" ✅    │
│    status: "pending"               │
│  }                                 │
│  USER TABLE: Empty                 │
└────────────────────────────────────┘
          ↓
┌────────────────────────────────────┐
│  Admin clicks "Approve":           │
│                                    │
│  User created in DB:               │
│  User {                            │
│    name: "John Doe",               │
│    email: "john@...",              │
│    role: "employee",               │
│    status: "active" ← APPLIED! ✅  │
│    companyId: 1                    │
│  }                                 │
└────────────────────────────────────┘
```

---

## 🚀 Database Tables Involved

```
┌─────────────────────────────────┐
│   STEP 1: Request Created       │
├─────────────────────────────────┤
│  approval_requests table        │
│  ├─ id: 5                       │
│  ├─ request_type: "user"        │
│  ├─ admin_name: "John Doe"      │
│  ├─ admin_email: "john@..."     │
│  ├─ requested_status: "active"  │
│  ├─ status: "pending"           │
│  └─ company_id: 1               │
│                                  │
│  users table                     │
│  (EMPTY - no user yet)          │
└─────────────────────────────────┘
          ↓ ADMIN APPROVES ↓
┌─────────────────────────────────┐
│   STEP 2: User Created          │
├─────────────────────────────────┤
│  approval_requests table        │
│  ├─ id: 5                       │
│  ├─ status: "approved" ✅       │
│  ├─ approved_by: 2              │
│  └─ user_id: 123                │
│                                  │
│  users table                     │
│  ├─ id: 123                      │
│  ├─ name: "John Doe"            │
│  ├─ email: "john@..."           │
│  ├─ status: "active" ✅         │
│  ├─ role: "employee"            │
│  └─ company_id: 1               │
│                                  │
│  employees table                │
│  ├─ id: 456                      │
│  ├─ name: "John Doe"            │
│  ├─ user_id: 123                │
│  └─ company_id: 1               │
└─────────────────────────────────┘
```

---

## 🔑 Key Status Field Journey

```
Form Submission
       ↓
    "active"  ← Admin chooses
       ↓
    Sent in JSON request
       ↓
    RequestUserApproval() method
       ↓
    Stored in: RequestedStatus = "active"  ✅ FIXED!
       ↓
    Saved to approval_requests table
       ↓
    Admin clicks "Approve"
       ↓
    ApproveUserRequest() method
       ↓
    Reads: requestedStatus = "active"  ✅
       ↓
    Creates User with status = "active"  ✅
       ↓
    User saved to users table
       ↓
    ✅ User created with correct status!
```

---

## 📱 UI Flow

```
┌──────────────────────────┐
│    USERS PAGE            │
│  ┌────────────────────┐  │
│  │ + Add User button  │  │
│  └────────────────────┘  │
└──────────────────────────┘
         ↓ Click
┌──────────────────────────┐
│   ADD USER MODAL         │
│  ┌────────────────────┐  │
│  │ Name:              │  │
│  │ Email:             │  │
│  │ Password:          │  │
│  │ Role: [employee]   │  │
│  │ Status: [active]   │  │ ← Choose status
│  │ [Add User]         │  │
│  └────────────────────┘  │
└──────────────────────────┘
         ↓ Submit
    ✅ Toast: "User request submitted"
         ↓
┌──────────────────────────┐
│  APPROVALS PAGE          │
│  [Pending User Requests] │ ← Tab
│  ┌────────────────────┐  │
│  │ John Doe           │  │
│  │ john@company.com   │  │
│  │ [Approve] [Reject] │  │
│  └────────────────────┘  │
└──────────────────────────┘
         ↓ Click Approve
    ✅ Toast: "User approved"
    ✅ John Doe can now login!
```

---

## 📊 Request-Response Cycle

```
CLIENT (Frontend)          SERVER (Backend)        DATABASE
     │                           │                     │
     │──┐                        │                     │
     │  │ "Add User" form        │                     │
     │<─┘ with status="active"   │                     │
     │                           │                     │
     ├──────────────────────────→│                     │
     │  POST /user/request       │                     │
     │  with RequestedStatus     │                     │
     │                           ├────────────────────→│
     │                           │ INSERT ApprovalReq  │
     │                           │ RequestedStatus:    │
     │                           │   "active"          │
     │                           │←────────────────────┤
     │                           │ Saved ✅            │
     │                           │                     │
     │←──────────────────────────┤                     │
     │  200 OK                   │                     │
     │  "request submitted"      │                     │
     │                           │                     │
     ├ Display Request Pending   │                     │
     │                           │                     │
     ├──────────────────────────→│                     │
     │  Click "Approve"          │                     │
     │  POST /user/5/approve     │                     │
     │                           ├────────────────────→│
     │                           │ 1. Read ApprovalReq │
     │                           │    Get Status:      │
     │                           │      "active" ✅    │
     │                           │                     │
     │                           │ 2. INSERT User      │
     │                           │    Status: "active" │
     │                           │    (from requested) │
     │                           │                     │
     │                           │ 3. INSERT Employee  │
     │                           │    Link to user     │
     │                           │                     │
     │                           │ 4. UPDATE Approval  │
     │                           │    Status: approved │
     │                           │←────────────────────┤
     │                           │ All saved ✅        │
     │←──────────────────────────┤                     │
     │  200 OK                   │                     │
     │  "User created"           │                     │
     │                           │                     │
✅ User John Doe is now in the system with status="active"
   Can login immediately! ✅
```

---

## 🎯 v2.0 Improvement Highlighted

```
BEFORE (v1.0) ❌
Admin chooses status="active"
           ↓
Status never saved
           ↓
User created with status="pending"
           ↓
User cannot login!

AFTER (v2.0) ✅
Admin chooses status="active"
           ↓
RequestedStatus field stores "active"
           ↓
User created with status="active"
           ↓
User can login immediately!
```

---

This workflow ensures:
✅ Proper approval process
✅ Status field respected
✅ Audit trail maintained
✅ User creation controlled
✅ Security maintained

