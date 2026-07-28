import CategoriesPage from "@/pages/CategoriesPage";
import DocumentDetailsPage from "@/pages/DocumentDetailsPage";
import HomePage from "@/pages/HomePage";
import PublishPage from "@/pages/PublishPage";
import __Layout from '@/Layout';


export const PAGES = {
    "home": HomePage,
    "publish": PublishPage,
    "documents": DocumentDetailsPage,
    "categories": CategoriesPage
    // "auth": Auth,
}

export const pagesConfig = {
    mainPage: "home",
    Pages: PAGES,
    Layout: __Layout,
};