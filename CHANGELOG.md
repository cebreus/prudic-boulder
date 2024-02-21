# Prudic Boulder Changelog

## 1.0.0 (2024-02-21)

### Major Features and Enhancements

- Adopted TypeScript for better code reliability, providing a more stable and predictable development experience.
- Developed UI components such as `Buttons`, `Modals`, and `Icons` to enhance the interface with interactive and visually appealing elements.
- Introduced page transitions and toast notifications with progress lines, improving the user experience through smooth navigation and informative feedback.
- Enhanced accessibility and styling across components, making the application more accessible and user-friendly.
- Implemented a comprehensive dark theme for the entire application, offering a visually comfortable alternative for users in low-light conditions.

### Refactoring

- Updated the `Alert` component to support inserting icons by their names, increasing flexibility and ease of use.
- Changed the path from `design-system` to `components` and added `@tailwindcss/typography` to improve typographical styling and readability.
- Disabled `cdn.tailwindcss.com` to potentially improve loading times and gain more control over styling resources.
- Updated `pnpm-lock.yaml` to accurately track and manage dependency versions.
- Eliminated duplicate `on:click` events to streamline event handling and reduce redundancy.
- Moved the `Icon` component and renamed `Modal` to `Dialog` for clearer naming and improved modularity.
- Refactored the `Dialog` into slots and the `ToastService` component to enhance code modularity and reusability.

### Documentation & Chores

- Introduced `husky`, `commitlint`, and `lint-staged` to enforce coding standards and streamline the development process.
- Set up a GitHub workflow for static code analysis, ensuring code quality and adherence to best practices.
- Moved peerDependencies to devDependencies and removed the unnecessary `.vscode` and `.vs` directory to simplify project setup and configuration.
- Adopted “loglevel” as a new logging solution for finer control over output levels.

### Fixes

- Fixed modal and toggle cells behaviour to ensure UI components work as intended.
- Added the missing `@typescript-eslint/recommended` to improve TypeScript linting and maintain code standards.
- Resolved toast notification logic issues and removed console.logs to clean up the codebase.
- Corrected pre-commit hook configurations and addressed various bugs including merge conflicts, button behaviour, and list rendering issues.
