# android-play-access — grant the service account Play Console access

The user does this in the browser; guide them:

1. Open Play Console → **Users and permissions** → **Invite new users**.
2. Paste the service account's `client_email` (from the ledger).
3. Under **App permissions**, add the app and grant at least: view app information, manage testing track releases, release to production, manage store presence. Grant **Admin (all permissions)** only if they want full automation.
4. Invite user → save.

Notes to share:
- Permissions can take from minutes up to a day to propagate; a 403 right after granting is normal.
- The Play API cannot create an app or its first release. The app must already exist in Play Console with its first bundle uploaded by hand.

Skip this step when the key was reused from fastlane `supply` and the user confirms it already uploads builds.

Done when: the user confirms the invite is saved with app permissions (or confirms prior access). Ledger note: date granted. The `android-login` verification is the real proof.
