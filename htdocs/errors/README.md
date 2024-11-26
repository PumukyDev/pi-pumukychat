# Errors

## 404 - Page Not Found

The **404 Error Page** serves two main purposes in this project:

1. **Inform the User**: Notify users that the page they are looking for does not exist.
2. **Redirect Shortened URLs**: Seamlessly handle cases where a user accesses a non-existent URL that might correspond to a shortened URL in the system.

---

### Functionality Overview

- **Scenario**: The user enters a non-existent URL, e.g., `pumukydev.com/test`.
- **Process**:
  1. The `error404.php` script is triggered.
  2. It extracts the last part of the URL (in this case, `test`) and checks if it exists in the IONOS TXT records (used for dynamic DNS management).
  3. **If the record exists**: The user is automatically redirected to the corresponding original long URL.
  4. **If the record does not exist**: The user sees a static 404 error page, with no indication of the behind-the-scenes check.

---

### Implementation Details

- The logic for checking IONOS TXT records ensures efficient handling of requests and avoids unnecessary delays for users.
- This approach leverages the error page to enhance user experience without modifying the traditional 404 functionality.

---

### Notes

- Ensure that the `error404.php` script has access to your IONOS TXT records API or a reliable data source.
- Users are not notified of the redirection process if it occurs, maintaining a seamless browsing experience.
- If the 404 error page is displayed, consider customizing it with helpful navigation links or a search bar to improve usability.

---

By combining traditional error handling with custom logic for URL redirection, this implementation maximizes functionality and user experience.
