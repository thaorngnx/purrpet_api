module.exports = {
  apps: [
    {
      name: 'PurrPet API',
      script: './index.js',
      args: 'start',
      env_production: {
        NODE_ENV: 'production',
      },
      env_development: {
        NODE_ENV: 'development',
      },
    },
  ],
};
