module.exports = {
  apps: [
    {
      name: 'NestJs-Builder',
      script: './dist/main.js',
      instances: 1,
      exec_mode: 'fork',
      max_restarts: 5,
      restart_delay: 1000,
      env: {
        NODE_ENV: 'production',
        PORT: 9000,
      },
      error_file: './dist/logs/error.log',
      out_file: './dist/logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true,
    },
  ],
};
