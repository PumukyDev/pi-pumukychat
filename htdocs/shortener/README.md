# URL Shortener

URL Shortener is a tool that allows you to shorten long URLs and generate a short URL. It uses the sha256 hashing algorithm to create the short URL and registers it in a TXT record on the server using a Bash script.

### Usage

1. Open your browser and access the index.php file.
2. In the form on the page, enter the long URL you want to shorten.
3. Click the "Acortar" / "Shorten" button. If everything is properly configured, you will receive a generated short URL that is also registered on the server.
4. Click on the link and you will be redirected.

### Example

If you enter a long URL like https://www.youtube.com/watch?v=jNQXAC9IVRw, the system will generate a short URL like https://pumukydev.com/4b0f48  (the hash is dynamically generated and unique for each URL).

![showing url-shortener](../../assets/screencasts/url-shortener.gif)

### Main Files

* `index.php`: The main file that contains the form and logic to shorten URLs.
* `post_txt.sh`: The Bash script that handles creating the TXT records on the DNS server.
* `error404.php`: This page appears when you click on a link that leads to a non-existent page. For example, https://pumukydev.com/4b0f48 doesn't exist on my website. When this happens, the 404 error page is triggered. It extracts the current URL, searches for the corresponding long URL in the IONOS TXT records, and then redirects you to the original URL.

If you want to use it, just create a `.env` file with the following structure:
   ```env
    ID=your_ionos_id
    SecretKey=your_ionos_secret_key