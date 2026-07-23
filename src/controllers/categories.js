// Import any needed model functions
import { getAllCategories, getCategoryByID, getCategoriesByProjectID, updateCategoryAssignments } from '../models/categories.js';
import { getProjectsByCategoryID, getProjectDetails } from '../models/projects.js';

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

const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;

    const projectDetails = await getProjectDetails(projectId);
    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByProjectID(projectId);

    const title = 'Assign Categories to Project';

    res.render('assign-categories', { title, projectId, projectDetails, categories, assignedCategories });
};

const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const selectedCategoryIds = req.body.categoryIds || [];
    
    // Ensure selectedCategoryIds is an array
    const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];
    await updateCategoryAssignments(projectId, categoryIdsArray);
    req.flash('success', 'Categories updated successfully.');
    res.redirect(`/project/${projectId}`);
};

// Export any controller functions
export { showCategoriesPage, showCategoriesDetailsPage, showAssignCategoriesForm, processAssignCategoriesForm };