const semver = require('semver');

function getNewVersion(program, version) {
  const semverList = [
    ['patch', 'Bump version '],
    ['minor', 'Release version '],
    ['major', 'Release major version ']
  ];
  const preSemverList = [
    'prepatch',
    'preminor',
    'premajor',
    'prerelease'
  ];
  let metadata = {};

  /**
   * 
   * @param {String} v old version
   * @param {String} release patch | minor | major | prepatch | premajor | preminor | prerelease
   */
  function increase(v, release, identifier) {
    return semver.inc(v, release, identifier);
  }

  semverList.forEach(sem => {
    if (program[sem[0]]) {
      if (metadata.version) {
        console.error(`${red('You specified more than one semver type, please specify only one!')}`);
        process.exit(1);
      }
      metadata.version = increase(version, sem[0]);
      metadata.prefix = sem[1];
    }
  });
  
  preSemverList.forEach(sem => {
    if (program[sem]) {
      if (metadata.version) {
        console.error(`${red('You specified more than one semver type, please specify only one!')}`);
        process.exit(1);
      }
      const identifier = typeof program[sem] === 'boolean' ? 'beta' : program[sem];
      metadata.version = increase(version, sem, identifier);
      metadata.prefix = `Prerelease ${identifier} version `;
    }
  });

  return metadata;
}

module.exports = getNewVersion;
