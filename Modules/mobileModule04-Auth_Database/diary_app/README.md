# Diary app

## Firebase

Database Firestore rules:

```js
rules_version = '2'; // Always use version '2' for the latest features and behavior.
service cloud.firestore {
  match /databases/{database}/documents {

    // Rule for the top-level 'users' collection
    // This allows authenticated users to create their own user document (if needed)
    // and read their own user document.
    // It also sets up the base for subcollections.
    match /users/{userId} {
      // Allow authenticated users to create their own user document (e.g., when signing up)
      // and read their own user document.
      allow create: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && request.auth.uid == userId;
      // Allow authenticated users to update their own user document.
      allow update: if request.auth != null && request.auth.uid == userId;
      // Disallow deleting user documents directly from the client.
      // Deletion of user data should typically be handled by a backend function.
      allow delete: if false;

      // Rule for the 'diaryNotes' subcollection under each user's document
      match /diaryNotes/{noteId} {
        // Allow read if the user is authenticated and owns the note.
        allow read: if request.auth != null && request.auth.uid == userId;

        // Allow update if the user is authenticated, owns the note,
        // and the updated data meets validation criteria.
        // This rule ensures that:
        // 1. Core fields (title, text, icon) maintain their integrity (type, size).
        // 2. The 'usermail' field cannot be changed.
        // 3. Only 'title', 'text', 'icon', fields can be part of an update payload.
        allow update: if request.auth != null && request.auth.uid == userId &&
                         // Validate the state of core fields after the update
                         request.resource.data.title is string &&
                         request.resource.data.title.size() > 0 &&
                         request.resource.data.title.size() <= 100 &&
                         request.resource.data.text is string &&
                         request.resource.data.text.size() > 0 &&
                         request.resource.data.text.size() <= 2500 &&
                         request.resource.data.icon is string &&
                         request.resource.data.icon.size() > 0 &&
                         request.resource.data.icon.size() <= 10 &&
                         // Ensure usermail is still a string (it was set at creation)
                         request.resource.data.usermail is string &&
                         // Crucially, usermail cannot be changed from its original value
                         request.resource.data.usermail == resource.data.usermail &&
                         // Restrict which fields can be part of an update payload.
                         // 'usermail' is not in this list, so it cannot be in the update payload.
                         // This also means other existing or new fields not listed here cannot be updated through this rule.
                         request.data.keys().hasOnly(['title', 'text', 'icon']);

        // Allow delete if the user is authenticated and owns the note.
        allow delete: if request.auth != null && request.auth.uid == userId;

        // Allow create ONLY if the user is authenticated, owns the note,
        // AND the data meets all validation criteria.
        allow create: if request.auth != null && request.auth.uid == userId &&
                         request.resource.data.keys().hasAll(['title', 'text', 'date', 'icon', 'usermail']) &&
                         request.resource.data.title is string &&
                         request.resource.data.title.size() > 0 &&
                         request.resource.data.title.size() <= 100 &&
                         request.resource.data.text is string &&
                         request.resource.data.text.size() > 0 &&
                         request.resource.data.text.size() <= 2500 &&
                         request.resource.data.icon is string &&
                         request.resource.data.icon.size() > 0 &&
                         request.resource.data.icon.size() <= 10 &&
                         // request.resource.data.date is timestamp &&
                         request.resource.data.usermail is string &&
                         request.resource.data.usermail.size() > 0
                         // Optional: Consider validating usermail against the authenticated user's email
                         // if request.auth.token.email is available and usermail should match it.
                         // Example: && request.resource.data.usermail == request.auth.token.email
                         ;
      }
    }
  }
}
```

## Diary info

- https://www.wikihow.com/Write-a-Diary
