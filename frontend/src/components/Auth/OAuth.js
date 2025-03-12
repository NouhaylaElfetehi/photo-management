import React from 'react';

const OAuth = () => {
  const handleGoogleLogin = () => {
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${process.env.REACT_APP_GOOGLE_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_GOOGLE_REDIRECT_URI}&response_type=token&scope=email profile`;
    window.location.href = googleAuthUrl;
  };

  const handleGitHubLogin = () => {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_GITHUB_REDIRECT_URI}&scope=user:email`;
    window.location.href = githubAuthUrl;
  };

  return (
    <div className="oauth-buttons">
      <button onClick={handleGoogleLogin} className="btn-google">
        <i className="fab fa-google"></i> Se connecter avec Google
      </button>
      <button onClick={handleGitHubLogin} className="btn-github">
        <i className="fab fa-github"></i> Se connecter avec GitHub
      </button>
    </div>
  );
};

export default OAuth;
