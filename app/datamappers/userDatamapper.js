import {client} from "../services/database.js";

const userDatamapper = {
    async create(form){
        const sql = `
            INSERT INTO "user"(firstname, lastname, pseudo, email, password)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, firstname, lastname, pseudo, email;`;
        const values = [form.firstname, form.lastname, form.pseudo, form.email, form.password];
        const result = await client.query(sql, values);
        return result.rows[0];
    },

    async findByEmailWithPassword(email){
        const sql = `
            SELECT *
            FROM "user"
            WHERE email = $1;`;
        const values = [email];
        const result = await client.query(sql, values);
        return result.rows[0];
    },

    async findByIdWithPassword(id){
        const sql = `
            SELECT *
            FROM "user"
            WHERE id = $1;`;
        const values = [id];
        const result = await client.query(sql, values);
        return result.rows[0];
    },

    async findEmail(email){
        const sql = `
            SELECT email
            FROM "user"
            WHERE email = $1;`;
        const values = [email];
        const result = await client.query(sql, values);
        return result.rows[0];
    },
    
    async findById(id){
        const sql = `
            SELECT *
            FROM getUserById($1);`;
        const values = [id];
        const result = await client.query(sql, values);
        return result.rows[0];
    },

    async findByPseudo(pseudo){
        const sql = `
            SELECT *
            FROM "user"
            WHERE pseudo = $1;`;
        const values = [pseudo];
        const result = await client.query(sql, values);
        return result.rows[0];
    },
    
    async update(form, id){
        const sql = `
            UPDATE "user"
            SET firstname = $1, lastname = $2, pseudo = $3, email = $4
            WHERE id = $5
            RETURNING id, firstname, lastname, pseudo, email;`;
        const values = [form.firstname, form.lastname, form.pseudo, form.email, id];
        const result = await client.query(sql, values);
        return result.rows[0];
    },
    
    async updateWithPassword(form, id){
        const sql = `
            UPDATE "user"
            SET firstname = $1, lastname = $2, pseudo = $3, email = $4, password = $5
            WHERE id = $6
            RETURNING id, firstname, lastname, pseudo, email;`;
        const values = [form.firstname, form.lastname, form.pseudo, form.email, form.newPassword, id];
        const result = await client.query(sql, values);
        return result.rows[0];
    },

    async delete(id){
        const sql = `
            DELETE FROM "user"
            WHERE id = $1;`;
        const values = [id];
        const result = await client.query(sql, values);
        return result.rowCount;
    }
}

export {userDatamapper};