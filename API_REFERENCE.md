# User Approval Workflow - API Reference

## API Endpoints

### 1. Request User Approval (Create Pending User Request)
```
POST /api/approvals/user/request
```

**Authentication:** Required (Admin role)

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@company.com",
  "password": "SecurePassword123",
  "role": "employee",
  "status": "active"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "id": 5,
    "name": "John Doe",
    "email": "john@company.com",
    "role": "employee",
    "status": "pending",
    "company_id": 1,
    "created_at": "2026-04-10 14:30:00"
  }
}
```

**Response (Error - 400):**
```json
{
  "error": "email already in use"
}
```

---

### 2. Get Pending User Approvals
```
GET /api/approvals/user/pending
```

**Authentication:** Required (Admin role)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 5,
      "name": "John Doe",
      "email": "john@company.com",
      "role": "employee",
      "status": "pending",
      "company_id": 1,
      "created_at": "2026-04-10 14:30:00"
    }
  ]
}
```

---

### 3. Approve User Request
```
POST /api/approvals/user/:id/approve
```

**Authentication:** Required (Admin role)  
**URL Parameter:** `id` = Approval request ID (e.g., 5)

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "User approved successfully",
  "data": {
    "id": 123,
    "name": "John Doe",
    "email": "john@company.com",
    "password": "",
    "role": "employee",
    "status": "active",
    "company_id": 1,
    "created_at": "2026-04-10 14:35:00"
  }
}
```

**What Happens:**
- User record is created in users table
- Status is set to the requested status (from approval request)
- Employee record is created automatically
- Approval request status changes to "approved"

---

### 4. Reject User Request
```
POST /api/approvals/user/:id/reject
```

**Authentication:** Required (Admin role)  
**URL Parameter:** `id` = Approval request ID

**Request Body (Optional):**
```json
{
  "message": "This email is already in use by another department"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User request rejected"
}
```

**What Happens:**
- No user is created
- Approval request status changes to "rejected"
- Reason is stored for audit trail

---

### 5. Bulk Import Users
```
POST /api/users/bulk-import
```

**Authentication:** Required (Admin role)

**Request:** Multipart form data with CSV/Excel file

**CSV Format:**
```
Name,Email,Role,Status
John Smith,john@company.com,salesman,active
Sarah Dev,sarah@company.com,developer,pending
Mike Staff,mike@company.com,staff,active
```

**Response:**
```json
{
  "success": true,
  "success_count": 3,
  "failed_count": 0,
  "results": [
    {
      "name": "John Smith",
      "email": "john@company.com",
      "status": "success",
      "message": "User request created"
    }
  ]
}
```

---

### 6. List All Approvals (Multiple Types)
```
GET /api/approvals
```

**Authentication:** Required

**Query Parameters:**
- `status`: Filter by status (pending, approved, rejected)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 5,
      "request_type": "user",
      "user_name": "John Doe",
      "user_email": "john@company.com",
      "company_id": 1,
      "status": "pending",
      "created_at": "2026-04-10 14:30:00"
    },
    {
      "id": 6,
      "request_type": "role_assignment",
      "user_name": "Jane Smith",
      "user_email": "jane@company.com",
      "company_id": 1,
      "status": "pending",
      "created_at": "2026-04-10 14:31:00"
    }
  ]
}
```

---

## Role Requirements

| Endpoint | Required Role |
|----------|---------------|
| POST /approvals/user/request | admin, super_admin |
| GET /approvals/user/pending | admin, super_admin |
| POST /approvals/user/:id/approve | admin, super_admin |
| POST /approvals/user/:id/reject | admin, super_admin |
| POST /users/bulk-import | admin, super_admin |

---

## Status Transitions

```
Approval Request:
  pending → approved → (user created)
  pending → rejected  → (no user created)

User Status (after approval):
  Depends on RequestedStatus field:
  - "active"   → User can login immediately
  - "inactive" → User exists but cannot login
  - "pending"  → User exists but cannot login (may need secondary approval)
```

---

## Testing with cURL

### Create User Request:
```bash
curl -X POST http://localhost:8080/api/approvals/user/request \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Password123",
    "role": "employee",
    "status": "active"
  }'
```

### Approve User:
```bash
curl -X POST http://localhost:8080/api/approvals/user/5/approve \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Reject User:
```bash
curl -X POST http://localhost:8080/api/approvals/user/5/reject \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Email already registered"
  }'
```

---

## Data Model

### ApprovalRequest (approval_requests table)

| Field | Type | Description |
|-------|------|-------------|
| id | uint | Primary key |
| request_type | string | "user", "admin", "role_assignment", "employee" |
| user_id | uint | User ID (0 if not yet created) |
| admin_name | string | Name of user being requested |
| admin_email | string | Email of user being requested |
| requested_role | string | Role being requested |
| requested_status | string | **NEW**: Status user should get on approval |
| password_hash | string | Hashed password (for security) |
| status | string | "pending", "approved", "rejected" |
| message | string | Approval reason/rejection reason |
| company_id | uint | Company this request belongs to |
| approved_by | uint | Admin who approved (if approved) |
| created_at | timestamp | When request was created |
| updated_at | timestamp | When request was last updated |

---

## Recent Changes (v2.0)

### Fixed
- ✅ `RequestedStatus` field now properly stored in ApprovalRequest
- ✅ User created with correct status on approval (not always "pending")
- ✅ Bulk import respects status field from CSV

### Impact
- Users now get the status set by the admin during request
- Admins have full control over user status at creation time
- Audit trail properly tracks requested status

---

## Troubleshooting

### Error: "company id not found"
- Make sure the Authorization header has a valid JWT token
- The token must be from a user in the same company

### Error: "invalid role"
Valid roles: admin, super_admin, employee, manager, salesman, developer, staff

### Error: "email already in use"
- Email must be unique across all users
- Check active, inactive, rejected, and pending users
- Use a different email or delete the old account

### Error: "approval request not found"
- Check the approval ID is correct
- Make sure you're using the approval request ID, not the user ID

