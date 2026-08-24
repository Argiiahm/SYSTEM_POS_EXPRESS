import dotenv from 'dotenv';

dotenv.config();

interface Config {
    port: number;
    node_env: string;
}

export const config: Config = {
    port: Number(process.env.PORT),
    node_env: process.env.NODE_ENV || 'development',
};
