module.exports = {
  apps: [
    {
      name: 'jobin-dashboard',
      script: 'node_modules/next/dist/bin/next',
      args: 'dev',
      cwd: './',
      env: {
        NODE_ENV: 'development',
      },
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      out_file: './logs/out.log',
      error_file: './logs/errors.log',
      merge_logs: true,
      windowsHide: true
    },
  ],
};
