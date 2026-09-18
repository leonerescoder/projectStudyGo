// Configuração do Banco de Dados Remoto (PostgreSQL - Neon Serverless)
export const DB_CONFIG = {
  type: "postgresql",
  server: "ep-restless-surf-ac2iaj96.sa-east-1.aws.neon.tech",
  user: "neondb_owner",
  password: "npg_yV8pkhqRndQ5",
  database: "neondb",
  port: "5432",
  sslmode: "require",
  channelBinding: "require",
  connectionString: "postgresql://neondb_owner:npg_yV8pkhqRndQ5@ep-restless-surf-ac2iaj96.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  consoleUrl: "https://console.neon.tech"
};
