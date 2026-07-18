import db from './db.js'

const getAllCategories = async() => {
    const query = `
      SELECT category_id, name
      FROM categories;
    `;

    const result = await db.query(query);

    return result.rows;
}

const getCategoryByID = async (category_id) => {
    const query = `
    SELECT category_id, name
    FROM categories
    WHERE category_id = ${category_id};`;
    
    const result = await db.query(query);

    return result.rows.length > 0 ? result.rows[0] : null;
}

const getCategoriesByProjectID = async (project_id) => {
    const query = `
        SELECT
            c.category_id,
            c.name,
            p.project_id
        FROM categories AS c
        JOIN projects AS p
            ON p.category_id = c.category_id
        WHERE p.project_id = ${project_id};
    `;

    const result = await db.query(query);

    return result.rows;
}

export {getAllCategories, getCategoryByID, getCategoriesByProjectID}  