var gulp = require('gulp'),
    cp = require('child_process'),
    args = require('yargs').argv,
    fs = require('fs');

gulp.task('deploy', () => {
  if(args.name){
    if(fs.existsSync(`deployed-releases/${args.name}`)){
      console.log(`Release "${args.name}" already deployed`);
      return;
    }
    if(!fs.existsSync(`releases/${args.name}.zip`)){
      console.log(`Release "${args.name}" does not exist`);
      return;
    }

    if(fs.existsSync(`releases/${args.name}.zip`)){
      // we unzip the release
      console.log(cp.execSync(`cd releases; unzip ${args.name}.zip -d ../deployed-releases`));
      console.log(`Release "${args.name}" deployed`)
    }
  } else {
    console.log('Parameter --name is required');
  }
});

gulp.task('remove', () => {
  if(args.name){
    if(!fs.existsSync(`deployed-releases/${args.name}`)){
      console.log(`Release "${args.name}" does not exist`);
      return;
    }

    if(fs.existsSync(`web`)){
      const currentRelease = getActiveRelease();

      if(currentRelease === args.name) {
        console.log(`Release "${args.name}" is the current active release, and cannot be removed`);
        return;
      }
    }

    if(fs.existsSync(`deployed-releases/${args.name}`)){
      console.log(cp.execSync(`cd deployed-releases; rm -rf ${args.name}`));
      console.log(`Release "${args.name}" removed`)
    }
  } else {
    console.log('Parameter --name is required');
  }
});

gulp.task('publish', () => {
  if(args.name){
    if(!fs.existsSync(`deployed-releases/${args.name}`)){
      console.log(`Release "${args.name}" does not exist`);
      return;
    }

    //If the web folder already exist, we will first remove the symlink to sites
    removeSymlinks();

    // Next we create new symlinks to the new release
    const root = process.env.PWD;
    console.log(cp.execSync(`ln -s ${root}/deployed-releases/${args.name}/config ${root}/config`));
    console.log(cp.execSync(`ln -s ${root}/deployed-releases/${args.name}/vendor ${root}/vendor`));
    console.log(cp.execSync(`ln -s ${root}/deployed-releases/${args.name}/web ${root}/web`));
    console.log(cp.execSync(`ln -s ${root}/sites ${root}/deployed-releases/${args.name}/web/sites`));
  } else {
    console.log('Parameter --name is required');
  }
});


gulp.task('symlink-remove', () => {
  removeSymlinks();
});


const removeSymlinks = () => {
  const root = process.env.PWD;

  //If the web folder already exist, we will first remove the symlink to sites
  if(fs.existsSync(`web`)){
    const currentWebDir = fs.readlinkSync('web');
    console.log(currentWebDir);
    if(fs.existsSync(`${currentWebDir}/sites`)){
      console.log(cp.execSync(`rm -rf ${currentWebDir}/sites`));
    }
  }

  // // Now we can remove possible existing symlinks
  if(fs.existsSync(`${root}/config`)){
    console.log(cp.execSync(`rm -rf ${root}/config`));
  }
  if(fs.existsSync(`${root}/vendor`)){
    console.log(cp.execSync(`rm -rf ${root}/vendor`));
  }
  if(fs.existsSync(`${root}/web`)){
    console.log(cp.execSync(`rm -rf ${root}/web`));
  }
}

// Helper functions
const getActiveRelease = () => {
  const currentWebDir = fs.readlinkSync('web');
  const currentReleaseDir = currentWebDir.substring(0, currentWebDir.length - 4); // remove /web from path
  const positionOfLastSlash = currentReleaseDir.lastIndexOf('/');
  const currentRelease = currentReleaseDir.substring(positionOfLastSlash+1, currentReleaseDir.length);
  return currentRelease;
}
