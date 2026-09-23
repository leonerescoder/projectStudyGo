// Helper for managing course images and local uploaded images cache

export const DEFAULT_CATEGORY_IMAGES = {
  'Tecnologia': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1800&q=90',
  'Mecânica': 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1800&q=90',
  'Gastronomia': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1800&q=90',
  'Idiomas': 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=1800&q=90',
  'Design & Artes': 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1800&q=90',
  'Saúde': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1800&q=90',
  'Moda': 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1800&q=90',
  'Artes': 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1800&q=90',
  'Música': 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1800&q=90',
  'Educação': 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1800&q=90',
  'DEFAULT': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1800&q=90'
};

const COURSE_IMAGES = [
  {
    terms: ['banco de dados', 'database', 'sql', 'postgres', 'mysql', 'nosql'],
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=2000&q=90'
  },
  {
    terms: ['cloud', 'nuvem', 'aws', 'azure', 'devops', 'docker'],
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2000&q=90'
  },
  {
    terms: ['javascript', 'typescript', 'web', 'frontend', 'front-end', 'html', 'css', 'react'],
    url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=2000&q=90'
  },
  {
    terms: ['java', 'programacao', 'programação', 'logica', 'lógica', 'python', 'algoritmo', 'codigo', 'código'],
    url: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=2000&q=90'
  },
  {
    terms: ['design', 'ui', 'ux', 'figma', 'prototip'],
    url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=2000&q=90'
  },
  {
    terms: ['seguranca', 'segurança', 'redes', 'network', 'cyber'],
    url: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=2000&q=90'
  },
  {
    terms: ['dados', 'data', 'inteligencia artificial', 'inteligência artificial', 'machine learning'],
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=2000&q=90'
  }
];

function getCourseName(course) {
  return `${course?.name || ''} ${course?.title || ''} ${course?.description || ''} ${course?.category || ''} ${course?.fieldOfStudy || ''}`.toLowerCase();
}

export function getCourseThemeImage(course) {
  const courseName = getCourseName(course);
  const match = COURSE_IMAGES.find(({ terms }) =>
    terms.some((term) => courseName.includes(term))
  );
  return match?.url || null;
}

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

  const themedImage = getCourseThemeImage(course);
  if (themedImage) return themedImage;

  if (course.urlImg && course.urlImg.trim() !== '') return course.urlImg;
  if (course.url_img && course.url_img.trim() !== '') return course.url_img;

  return getFallbackImageUrl(course.Field_of_study || course.fieldOfStudy || course.category);
}
