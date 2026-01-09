# App Settings Feature

## Overview
This feature allows administrators to control application-wide settings through an admin dashboard interface. The primary feature is the ability to enable/disable task functionality globally.

## Architecture

### Backend Components

#### 1. Model (`apps/backend/src/model/appSettingsModel.ts`)
- MongoDB schema for storing app settings
- Fields:
  - `taskFeatureEnabled`: Boolean (default: true) - Controls if tasks are available
  - `maintenanceMode`: Boolean (default: false) - For future maintenance mode
  - `announcementMessage`: String - For global announcements
- Includes helper function `getOrCreateAppSettings()` to ensure settings always exist

#### 2. Controller (`apps/backend/src/modules/appSettings/controller.ts`)
- `getAppSettings`: Retrieves current app settings
- `updateAppSettings`: Updates app settings (admin only)

#### 3. Router (`apps/backend/src/modules/appSettings/router.ts`)
- Defines API routes:
  - `GET /api/app-settings` - Get current settings
  - `PATCH /api/app-settings` - Update settings

#### 4. Contract (`libs/shared/contracts/src/lib/appSettings/`)
- Type-safe API contract using ts-rest
- Zod schemas for validation
- Shared between frontend and backend

### Frontend Components

#### 1. Admin Settings Page (`apps/task/src/features/admin/views/AppSettingsContent.tsx`)
- Admin interface to manage settings
- Features:
  - Toggle switches for taskFeatureEnabled and maintenanceMode
  - Text area for announcement messages
  - Real-time save functionality with feedback
  - Beautiful UI with animations

#### 2. TasksView Integration (`apps/task/src/features/dashboard/views/TasksView.tsx`)
- Fetches app settings on mount and refetches every minute
- Combines TWO conditions to determine if tasks are allowed:
  1. Admin has enabled task feature (`taskFeatureEnabled`)
  2. Current time is within allowed window (7pm-10pm)
- Displays appropriate notice banner based on status
- Disables/enables task cards based on combined conditions

## How It Works

### Task Availability Logic
```typescript
// Tasks are allowed ONLY if BOTH conditions are true:
const isTaskFeatureEnabled = appSettings.taskFeatureEnabled; // Admin control
const isTaskTimeAllowed = (currentHour >= 19 && currentHour < 22); // Time window
const areTasksAllowed = isTaskFeatureEnabled && isTaskTimeAllowed;
```

### User Experience
1. **Tasks Disabled by Admin**: Shows "Task feature is currently disabled by admin"
2. **Outside Time Window**: Shows "Tasks can only be done between 7:00 PM and 10:00 PM"
3. **Both Enabled**: Shows "Tasks Are Available Now!"

### Admin Experience
1. Navigate to "App Settings" in admin dashboard
2. Toggle "Task Feature Control" switch
3. Click "Save Changes"
4. Settings apply immediately to all users

## Setup & Initialization

### Automatic Initialization
App settings are automatically initialized when the server starts:
- See `apps/backend/src/main.ts`
- Calls `initializeAppSettings()` on startup
- Creates default settings if none exist

### Manual Initialization (if needed)
```bash
cd apps/backend
npx ts-node src/scripts/initializeAppSettings.ts
```

## API Endpoints

### Get App Settings
```http
GET /api/app-settings
Response: {
  success: true,
  data: {
    _id: string,
    taskFeatureEnabled: boolean,
    maintenanceMode: boolean,
    announcementMessage: string,
    createdAt: string,
    updatedAt: string
  }
}
```

### Update App Settings
```http
PATCH /api/app-settings
Body: {
  taskFeatureEnabled?: boolean,
  maintenanceMode?: boolean,
  announcementMessage?: string
}
Response: {
  success: true,
  message: "App settings updated successfully",
  data: { /* updated settings */ }
}
```

## Database

### Collection
- Name: `appsettings`
- Singleton pattern (only one document)
- Indexed to ensure uniqueness

### Default Values
```javascript
{
  taskFeatureEnabled: true,
  maintenanceMode: false,
  announcementMessage: ""
}
```

## Future Enhancements

The architecture is designed to be extensible. Future settings that could be added:

1. **Maintenance Mode UI**: Display maintenance page when enabled
2. **Announcement Banner**: Show global announcements to all users
3. **Task Time Window**: Make the 7pm-10pm window configurable
4. **Feature Flags**: Enable/disable specific features
5. **Rate Limiting**: Configure rate limits per feature
6. **Emergency Shutdown**: Quick disable for all features

## Integration Points

Files modified/created for this feature:

### Backend
- ✅ `apps/backend/src/model/appSettingsModel.ts` (new)
- ✅ `apps/backend/src/modules/appSettings/controller.ts` (new)
- ✅ `apps/backend/src/modules/appSettings/router.ts` (new)
- ✅ `apps/backend/src/scripts/initializeAppSettings.ts` (new)
- ✅ `apps/backend/src/modules/index.ts` (modified)
- ✅ `apps/backend/src/main.ts` (modified)

### Shared Contracts
- ✅ `libs/shared/contracts/src/lib/appSettings/schema.ts` (new)
- ✅ `libs/shared/contracts/src/lib/appSettings/contract.ts` (new)
- ✅ `libs/shared/contracts/src/lib/index.ts` (modified)
- ✅ `libs/shared/contracts/src/index.ts` (modified)

### Frontend
- ✅ `apps/task/src/features/admin/views/AppSettingsContent.tsx` (new)
- ✅ `apps/task/src/pages/dashboard/AdminDashboardPage.tsx` (modified)
- ✅ `apps/task/src/features/dashboard/views/TasksView.tsx` (modified)

## Testing

### Manual Testing Steps

1. **Test Admin Toggle**:
   - Login as admin
   - Go to "App Settings"
   - Toggle task feature off
   - Save changes
   - Verify user dashboard shows disabled state

2. **Test Time Window**:
   - Wait for or set system time to outside 7pm-10pm
   - Verify tasks are disabled
   - Set time to 7pm-10pm
   - Verify tasks are enabled (if admin toggle is on)

3. **Test Combined Logic**:
   - Admin off + wrong time = disabled ✓
   - Admin off + right time = disabled ✓
   - Admin on + wrong time = disabled ✓
   - Admin on + right time = enabled ✓

## Notes

- Settings are cached in frontend and refetch every 60 seconds
- Changes apply immediately without requiring users to refresh
- Task cards show visual feedback (opacity, blur, cursor) when disabled
- Notice banner dynamically updates based on current state
- Admin settings are persisted in MongoDB
