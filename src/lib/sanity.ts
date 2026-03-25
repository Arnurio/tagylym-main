import { createClient } from "@sanity/client";

export const sanityClient = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "eb50c3xu",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "datasetnumber1",
    apiVersion: "2024-01-01",
    useCdn: true,
    token: process.env.SANITY_API_TOKEN,
});

// ─── Lesson queries ──────────────────────────────────────

export async function getLessonBySlug(slug: string, locale: string = 'kk') {
    const l = locale === 'en' ? 'en' : locale === 'ru' ? 'ru' : 'kk';
    return sanityClient.fetch(
        `*[_type == "lesson" && slug.current == $slug][0]{
      "title": coalesce(title_${l}, title_kk, title),
      "slug": slug.current,
      courseSlug,
      order,
      isFree,
      "videoUrl": coalesce(videoUrl_${l}, videoUrl_kk, videoUrl),
      "presentationUrl": coalesce(presentationUrl_${l}, presentationUrl_kk, presentationUrl),
      "content": coalesce(content_${l}, content_kk, content),
      "tip": coalesce(tip_${l}, tip_kk, tip),
      rubricCriterion,
      rubricLevel
    }`,
        { slug }
    );
}

export async function getLessonsByCourseSlug(courseSlug: string, locale: string = 'kk') {
    const l = locale === 'en' ? 'en' : locale === 'ru' ? 'ru' : 'kk';
    return sanityClient.fetch(
        `*[_type == "lesson" && courseSlug == $courseSlug] | order(order asc){
      "title": coalesce(title_${l}, title_kk, title),
      "slug": slug.current,
      order,
      isFree,
      "videoUrl": coalesce(videoUrl_${l}, videoUrl_kk, videoUrl)
    }`,
        { courseSlug }
    );
}

// ─── Course queries ──────────────────────────────────────

export async function getCourseBySlug(slug: string, locale: string = 'kk') {
    const l = locale === 'en' ? 'en' : locale === 'ru' ? 'ru' : 'kk';
    return sanityClient.fetch(
        `*[_type == "course" && slug.current == $slug][0]{
      "title": coalesce(title_${l}, title_kk, title),
      "slug": slug.current,
      "description": coalesce(description_${l}, description_kk, description),
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
