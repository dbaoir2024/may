import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "Oirrms!!22",
    database: "edms",
    synchronize: true,
    logging: true,
    entities: ["src/entity/*.ts"],
    migrations: ["src/migration/*.ts"],
});

AppDataSource.initialize()
    .then(() => console.log("Database connected!"))
    .catch((err) => console.error("Database connection error:", err));