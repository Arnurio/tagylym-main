import { createClient } from "@sanity/client";

export const sanityClient = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "eb50c3xu",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "datasetnumber1",
    apiVersion: "2024-01-01",
    useCdn: true,
    token: process.env.SANITY_API_TOKEN,
});

// ─── Lesson queries ──────────────────────────────────────

export async function getLessonBySlug(slug: string) {
    return sanityClient.fetch(
        `*[_type == "lesson" && slug.current == $slug][0]{
      title,
      "slug": slug.current,
      courseSlug,
      order,
      isFree,
      videoUrl,
      content,
      tip,
      rubricCriterion,
      rubricLevel
    }`,
        { slug }
    );
}

export async function getLessonsByCourseSlug(courseSlug: string) {
    return sanityClient.fetch(
        `*[_type == "lesson" && courseSlug == $courseSlug] | order(order asc){
      title,
      "slug": slug.current,
      order,
      isFree,
      videoUrl
    }`,
        { courseSlug }
    );
}

// ─── Course queries ──────────────────────────────────────

export async function getCourseBySlug(slug: string) {
    return sanityClient.fetch(
        `*[_type == "course" && slug.current == $slug][0]{
      title,
      "slug": slug.current,
      description,
      category,
      level,
      order
    }`,
        { slug }
    );
}

export async function getAllCourses() {
    return sanityClient.fetch(
        `*[_type == "course"] | order(order asc){
      title,
      "slug": slug.current,
      description,
      category,
      level,
      order
    }`
    );
}
