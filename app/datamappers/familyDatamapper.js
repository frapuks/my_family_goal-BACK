import {client} from "../services/database.js";

const familyDatamapper = {
    async create(form){
        const sql = `
            INSERT INTO family (name)
            VALUES ($1)
            RETURNING *;`;
        const values = [form.name];
        const result = await client.query(sql, values);
        return result.rows[0];
    },

    async findByName(name){
        const sql = `
            SELECT *
            FROM family
            WHERE name = $1;`;
        const values = [name];
        const result = await client.query(sql, values);
        return result.rows[0];
    },

    async findById(id){
        const sql = `
            SELECT *
            FROM getFamilyById($1);`;
        const values = [id];
        const result = await client.query(sql, values);
        return result.rows[0];
    },

    async update(form, id){
        const sql = `
            UPDATE family
            SET name = $1
            WHERE id = $2
            RETURNING *;`;
        const values = [form.name, id];
        const result = await client.query(sql, values);
        return result.rows[0];
    },

    async delete(id){
        const sql = `
            DELETE FROM family
            WHERE id = $1;`;
        const values = [id];
        const result = await client.query(sql, values);
        return result.rowCount;
    },

    // LINK
    async createLink(userId, familyId, isParent){
        const sql = `
            INSERT INTO user_has_family (user_id, family_id, "isParent")
            VALUES ($1, $2, $3)
            RETURNING *;`;
        const values = [userId, familyId, isParent];
        const result = await client.query(sql, values);
        return result.rows[0];
    },

    async getLinksByFamilyId(familyId) {
        const sql = `
            SELECT *
            FROM user_has_family
            WHERE family_id = $1`;
        const values = [familyId];
        const result = await client.query(sql, values);
        return result.rows[0];
    },

    async updateRole(userId, familyId, isParent){
        const sql = `
            UPDATE user_has_family
            SET "isParent" = $3
            WHERE  user_id = $1 AND family_id = $2
            RETURNING *;`;
        const values = [userId, familyId, isParent];
        const result = await client.query(sql, values);
        return result.rows[0];
    },

    async deleteLink(userId, familyId){
        const sql = `
            DELETE FROM user_has_family
            WHERE user_id = $1
            AND family_id = $2;`;
        const values = [userId, familyId];
        const result = await client.query(sql, values);
        return result.rowCount;
    }
}

export {familyDatamapper};