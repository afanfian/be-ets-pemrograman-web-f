import { Sequelize } from "sequelize";
import * as bcrypt from "bcrypt";
import { logger } from "../shared/util";

export const seedDatabase = async (dbConn: Sequelize) => {
    try {
        const password = await bcrypt.hash("Pweb14!", 10);
        // Huruf besar 1, angka 1, huruf kecil 1 dan simbol 1 maksimal 20 password
        await dbConn.models["user"].findOrCreate({
            where: { id: "5a53d571-f85b-4373-8935-bc7eefab74f6" },
            defaults: {
                nama: "Pemrograman Web F",
                // hanya boleh spasi huruf besar dan kecil tidak boleh menggunakan angka dan simbol`
                email: "pwebf@gmail.com",
                password: password,
            },
        });
        await dbConn.models["score"].findOrCreate({
            defaults: {
                nama: "Fian",
                score: "123",
            },
        });
        logger.info("database seeded");
    } catch (error) {
        logger.error(`unable to seed database: ${(error as Error).message}`);
    }
};
