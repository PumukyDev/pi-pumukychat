# PumukyDev Web Server To Do list 
Here is a to do list of my proyect

### Todo

- [ ] Implement more errors than 404
- [ ] Make some performance tests

### In Progress

- [ ] Make ansible provision
  - [X] Plan ansible estructure
  - [ ] Make .yml files
    - [ ] main.yml
    - [X] base_packages.yml
    - [X] apache.yml
    - [ ] monitoring.yml

- [ ] General README.md


### Done ✓

- [x] Open 80 and 443 ports on the router
- [X] Buy the "PumukyDev.com" domain
- [X] Configure dynamic dns via curl posts to ionos
- [X] Make a basic web interface with html, css and php
- [X] Configure password protected zones (/admin and /status)
- [X] Make url-shortener
  - [X] Mechanism to short the user url
    - [X] Scripts to auto-post user url (long url) and auto-generated url (short url) to a txt record
  - [X] Mechanism to automatically redirect the user when it clicks on the link
    - [X] Make a url reverter script (made with google dns)
    - [X] Implement auto redirection script into error404
- [X] Enable https with ionos certificates
- [X] "Errors" folder README.md
- [X] Configure /status

