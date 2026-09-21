// Helper for managing course images and local uploaded images cache

export const DEFAULT_CATEGORY_IMAGES = {
  'Tecnologia': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
  'Mecânica': 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
  'Gastronomia': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
  'Idiomas': 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=600&q=80',
  'Design & Artes': 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=600&q=80',
  'Saúde': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80',
  'Moda': 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=600&q=80',
  'Artes': 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80',
  'Música': 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
  'Educação': 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80',
  'DEFAULT': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80'
};

export function getFallbackImageUrl(category) {
  return DEFAULT_CATEGORY_IMAGES[category] || DEFAULT_CATEGORY_IMAGES['Tecnologia'] || DEFAULT_CATEGORY_IMAGES['DEFAULT'];
}

export function saveLocalCourseImage(courseIdOrName, dataUrl) {
  if (!courseIdOrName || !dataUrl) return;
  try {
    localStorage.setItem(`studygo_course_img_${courseIdOrName}`, dataUrl);
  } catch (e) {
    console.warn('LocalStorage image storage exceeded or unavailable:', e);
  }
}

export function getCourseImageUrl(course) {
  if (!course) return DEFAULT_CATEGORY_IMAGES['DEFAULT'];
  
  try {
    if (course.id) {
      const localById = localStorage.getItem(`studygo_course_img_${course.id}`);
      if (localById) return localById;
    }
    
    if (course.name || course.title) {
      const localByName = localStorage.getItem(`studygo_course_img_${course.name || course.title}`);
      if (localByName) return localByName;
    }
  } catch (e) {
    // Local storage disabled or error
  }

  if (course.urlImg && course.urlImg.trim() !== '') {
    return course.urlImg;
  }
  if (course.url_img && course.url_img.trim() !== '') {
    return course.url_img;
  }

  return getFallbackImageUrl(course.Field_of_study || course.fieldOfStudy || course.category);
}
