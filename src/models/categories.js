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
        JOIN project_category AS p
            ON p.category_id = c.category_id
        WHERE p.project_id = $1;
    `;

    const queryParams = [project_id];
    const result = await db.query(query, queryParams);

    return result.rows;
}

const assignCategoryToProject = async(categoryId, projectId) => {
    const query = `
        INSERT INTO project_category (category_id, project_id)
        VALUES ($1, $2);
    `;

    await db.query(query, [categoryId, projectId]);
}

const updateCategoryAssignments = async(projectId, categoryIds) => {
    // First, remove existing category assignments for the project
    const deleteQuery = `
        DELETE FROM project_category
        WHERE project_id = $1;
    `;
    await db.query(deleteQuery, [projectId]);

    // Next, add the new category assignments
    for (const categoryId of categoryIds) {
        await assignCategoryToProject(categoryId, projectId);
    }
};

const createCategory = async(categoryName) => {
    const query = `
        INSERT INTO categories (name)
        VALUES ($1)
        RETURNING category_id;
    `;

    const result = await db.query(query, [categoryName]);
    return result.rows[0].category_id;
};

const updateCategory = async(category_id, categoryName) => {
    const query = `
    UPDATE categories
    SET name = $2
    WHERE category_id = $1
    RETURNING category_id;
    `;

    const queryParams = [category_id, categoryName];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Category not found');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Updated Category with ID:', category_id);
    }
};

export {getAllCategories, getCategoryByID, getCategoriesByProjectID, updateCategoryAssignments, createCategory, updateCategory}  