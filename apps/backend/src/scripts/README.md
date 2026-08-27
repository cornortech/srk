# Admin Creation Script

Script to create multi-domain admin users for SRK University platform.

## Usage

```bash
npm run create:admin <email> <password> <domain>
```

### Parameters

1. **email** - Admin email address
2. **password** - Admin password (min 6 characters)
3. **domain** - Admin domain: `university`, `task`, or `grow`

## Examples

### Create University Admin
```bash
npm run create:admin admin@university.com SecurePass123 university
```
- Login → Redirects to University Admin Dashboard (`/admin`)
- Direct access, no SSO needed

### Create Task Admin
```bash
npm run create:admin admin@task.com SecurePass123 task
```
- Login → SSO redirect to Task Admin Dashboard
- Flow: University Login → Generate SSO Code → Task Domain → `/admin`

### Create Grow Admin
```bash
npm run create:admin admin@grow.com SecurePass123 grow
```
- Login → SSO redirect to Grow Admin Dashboard
- Flow: University Login → Generate SSO Code → Grow Domain → `/admin`

## Default Values (if no args provided)

```bash
npm run create:admin
```
- Email: `admin@srk.com`
- Password: `Admin@123`
- Domain: `university`

## Admin Domains Explained

| Domain | Login Entry | Redirect Behavior | Dashboard Location |
|--------|------------|-------------------|-------------------|
| `university` | University Login | Direct | Same domain `/admin` |
| `task` | University Login | SSO to Task domain | Task domain `/admin` |
| `grow` | University Login | SSO to Grow domain | Grow domain `/admin` |

## Security Notes

- All passwords are hashed using bcrypt
- SSO codes expire in 30 seconds
- Access tokens expire in 15 minutes
- Refresh tokens expire in 30 days
- All auth uses HTTP-only cookies

## Script Validation

The script validates:
- ✓ Email format
- ✓ Password length (min 6 chars)
- ✓ Domain is valid (`university`, `task`, `grow`)
- ✓ Duplicate email check

## Database Connection

Uses `DATABASE_URL` from `.env` file:
```env
DATABASE_URL=mongodb://localhost:27017/srk-university
```
