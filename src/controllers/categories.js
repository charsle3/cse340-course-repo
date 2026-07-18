// Import any needed model functions
import { getAllCategories, getCategoryByID } from '../models/categories.js';
import { getProjectsByCategoryID } from '../models/projects.js';

// Define any controller functions
const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';

    res.render('categories', { title, categories });
};

const showCategoriesDetailsPage = async (req, res) => {
    const id = req.params.id
    const category = await getCategoryByID(id);
    const projects = await getProjectsByCategoryID(id);
    const title = category.name;

    res.render('category', { title, category, projects});
}

// Export any controller functions
export { showCategoriesPage, showCategoriesDetailsPage };