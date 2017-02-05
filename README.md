# drupal8-gulp-deployment-manager
Gulp scripts to manage drupal8 deploys

Folder structure should look like this
  - releases (zipped version of possible releases, you should upload a new zip to this folder with a unique name)
  - deployed-releases (unzipped version of the possible releases to switch to)
  - sites (sites folder of your Drupal installation, should be excluded from the release, as a symlink will be created to this folder)

Symlinks will be created pointing to the active deployed release in the deployed releases folder
  - config (containing the Drupal 8 config folder, must be configured in settings.php)
  - web (containing the Drupal installation, this should be the webroot)
  - vendor (containing the Composer packages)
