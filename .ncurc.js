module.exports = {
  target: (name, semver) => {
    if (parseInt(semver[0]?.major) === '0') return 'minor';
    if (name === '@types/node') return 'minor';
    return 'latest';
  },
};