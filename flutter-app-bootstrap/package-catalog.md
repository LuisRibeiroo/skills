# Package Catalog

Default package suggestions for Flutter app bootstrap.
Present each category to the user with defaults and pub.dev links. Accept overrides or removals.

---

## Auth

| Package              | Link                                                   | Notes                |
| -------------------- | ------------------------------------------------------ | -------------------- |
| `google_sign_in`     | [pub.dev](https://pub.dev/packages/google_sign_in)     | Google OAuth sign-in |
| `sign_in_with_apple` | [pub.dev](https://pub.dev/packages/sign_in_with_apple) | Apple Sign In        |

## Dependency Injection

| Package         | Link                                              | Notes                    |
| --------------- | ------------------------------------------------- | ------------------------ |
| `auto_injector` | [pub.dev](https://pub.dev/packages/auto_injector) | Lightweight DI container |

**Alternatives:** `get_it` ([pub.dev](https://pub.dev/packages/get_it)) — widely used service locator; `riverpod` ([pub.dev](https://pub.dev/packages/riverpod)) — if also used for state.

## Navigation

| Package     | Link                                          | Notes                                               |
| ----------- | --------------------------------------------- | --------------------------------------------------- |
| `go_router` | [pub.dev](https://pub.dev/packages/go_router) | Declarative routing, deep links, StatefulShellRoute |

**Alternatives:** `auto_route` ([pub.dev](https://pub.dev/packages/auto_route)) — code-gen based routing.

## Logging

| Package  | Link                                       | Notes                  |
| -------- | ------------------------------------------ | ---------------------- |
| `logger` | [pub.dev](https://pub.dev/packages/logger) | Pretty console logging |

**Alternatives:** `talker` ([pub.dev](https://pub.dev/packages/talker)) — logging with error tracking integration.

## State Management

| Package   | Link                                        | Notes                       |
| --------- | ------------------------------------------- | --------------------------- |
| `signals` | [pub.dev](https://pub.dev/packages/signals) | Fine-grained reactive state |

**Alternatives:** `provider` ([pub.dev](https://pub.dev/packages/provider)) — simple InheritedWidget wrapper; `riverpod` ([pub.dev](https://pub.dev/packages/riverpod)) — compile-safe, provider-based; `flutter_bloc` ([pub.dev](https://pub.dev/packages/flutter_bloc)) — event-driven state.

## Config / Analytics / Crash Reporting

| Package                  | Link                                                       | Notes                   |
| ------------------------ | ---------------------------------------------------------- | ----------------------- |
| `firebase_core`          | [pub.dev](https://pub.dev/packages/firebase_core)          | Firebase initialization |
| `firebase_analytics`     | [pub.dev](https://pub.dev/packages/firebase_analytics)     | Event tracking          |
| `firebase_crashlytics`   | [pub.dev](https://pub.dev/packages/firebase_crashlytics)   | Crash reporting         |
| `firebase_remote_config` | [pub.dev](https://pub.dev/packages/firebase_remote_config) | Remote configuration    |

## Storage

| Package                 | Link                                                      | Notes                              |
| ----------------------- | --------------------------------------------------------- | ---------------------------------- |
| `rx_shared_preferences` | [pub.dev](https://pub.dev/packages/rx_shared_preferences) | Reactive SharedPreferences wrapper |

**Alternatives:** `shared_preferences` ([pub.dev](https://pub.dev/packages/shared_preferences)) — simpler, non-reactive; `hive_ce` ([pub.dev](https://pub.dev/packages/hive_ce)) — community-maintained Hive fork, fast key-value store.

## Media & Utilities

| Package                | Link                                                     | Notes                                  |
| ---------------------- | -------------------------------------------------------- | -------------------------------------- |
| `cached_network_image` | [pub.dev](https://pub.dev/packages/cached_network_image) | Cached image loading with placeholders |
| `share_plus`           | [pub.dev](https://pub.dev/packages/share_plus)           | Native share dialog                    |
| `url_launcher`         | [pub.dev](https://pub.dev/packages/url_launcher)         | Open URLs, email, phone                |
| `flutter_svg`          | [pub.dev](https://pub.dev/packages/flutter_svg)          | SVG rendering                          |

## Misc / UI

| Package              | Link                                                   | Notes                        |
| -------------------- | ------------------------------------------------------ | ---------------------------- |
| `google_fonts`       | [pub.dev](https://pub.dev/packages/google_fonts)       | Google Fonts integration     |
| `package_info_plus`  | [pub.dev](https://pub.dev/packages/package_info_plus)  | App version/build info       |
| `permission_handler` | [pub.dev](https://pub.dev/packages/permission_handler) | Runtime permissions          |
| `flash`              | [pub.dev](https://pub.dev/packages/flash)              | Snackbar/toast/banner alerts |
| `redacted`           | [pub.dev](https://pub.dev/packages/redacted)           | Skeleton loading screens     |
| `smooth_sheets`      | [pub.dev](https://pub.dev/packages/smooth_sheets)      | Bottom sheet transitions     |
