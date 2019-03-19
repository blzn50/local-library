const isAuthenticated = (req, res, next) => {
  // console.log(req.path);
  // console.log('req.isAuthenticated(): ', req.isAuthenticated());
  // console.log('req.session: ', req.session);
  // console.log('req.user: ', req.user);
  if (req.path === '/') {
    return next();
  }
  if (req.isAuthenticated()) return next();

  return res.status(401).send({ notAuth: 'User not authenticated' });
};

module.exports = isAuthenticated;
