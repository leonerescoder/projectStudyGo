/**
 * Service to manage course ranking:
 * Total Ranking = Organic User Clicks + Admin Boosted Points (Paid points)
 */

const CLICKS_PREFIX = 'studygo_course_clicks_';
const BOOST_PREFIX = 'studygo_course_boost_';
export const RANKING_UPDATE_EVENT = 'studygo_ranking_updated';

/**
 * Get total organic clicks registered for a course
 * @param {number|string} courseId 
 * @returns {number}
 */
export function getCourseClicks(courseId) {
  if (!courseId) return 0;
  try {
    const val = localStorage.getItem(`${CLICKS_PREFIX}${courseId}`);
    return val ? parseInt(val, 10) || 0 : 0;
  } catch (e) {
    console.error('Error reading course clicks:', e);
    return 0;
  }
}

/**
 * Get total boosted points added by administrator for a course
 * @param {number|string} courseId 
 * @returns {number}
 */
export function getCourseBoostedPoints(courseId) {
  if (!courseId) return 0;
  try {
    const val = localStorage.getItem(`${BOOST_PREFIX}${courseId}`);
    return val ? parseInt(val, 10) || 0 : 0;
  } catch (e) {
    console.error('Error reading boosted points:', e);
    return 0;
  }
}

/**
 * Calculate the complete stats breakdown for a course
 * Ranking Total = (Initial base ranking if any) + Clicks + Boosted Points
 * @param {Object} course 
 * @returns {{ clicks: number, boostedPoints: number, baseRanking: number, totalRanking: number }}
 */
export function getCourseStats(course) {
  if (!course) {
    return { clicks: 0, boostedPoints: 0, baseRanking: 0, totalRanking: 0 };
  }
  const id = course.id;
  const clicks = getCourseClicks(id);
  const boostedPoints = getCourseBoostedPoints(id);
  // Base ranking starts at 0 for new courses, or whatever is provided in course
  const baseRanking = typeof course.baseRanking === 'number' ? course.baseRanking : (typeof course.ranking === 'number' && !localStorage.getItem(`${CLICKS_PREFIX}${id}`) && !localStorage.getItem(`${BOOST_PREFIX}${id}`) ? course.ranking : 0);
  
  const totalRanking = clicks + boostedPoints + baseRanking;

  return {
    clicks,
    boostedPoints,
    baseRanking,
    totalRanking
  };
}

/**
 * Enrich a course object with dynamic ranking fields
 * @param {Object} course 
 * @returns {Object}
 */
export function enrichCourseWithRanking(course) {
  if (!course) return course;
  const stats = getCourseStats(course);
  return {
    ...course,
    clicks: stats.clicks,
    boostedPoints: stats.boostedPoints,
    rawRanking: stats.totalRanking,
    ranking: stats.totalRanking
  };
}

/**
 * Automatically record a user click on a course
 * @param {number|string} courseId 
 * @param {Object} [course] 
 * @returns {number} new clicks count
 */
export function recordCourseClick(courseId, course = null) {
  if (!courseId) return 0;
  try {
    const currentClicks = getCourseClicks(courseId);
    const newClicks = currentClicks + 1;
    localStorage.setItem(`${CLICKS_PREFIX}${courseId}`, newClicks.toString());

    // Dispatch global event for live UI reactivity
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(RANKING_UPDATE_EVENT, {
        detail: {
          courseId,
          clicks: newClicks,
          boostedPoints: getCourseBoostedPoints(courseId),
          type: 'CLICK'
        }
      }));
    }

    return newClicks;
  } catch (e) {
    console.error('Error saving course click:', e);
    return 0;
  }
}

/**
 * Boost (up) course points (Administrator paid points tool)
 * @param {number|string} courseId 
 * @param {number} pointsToAdd 
 * @returns {{ clicks: number, boostedPoints: number, totalRanking: number }}
 */
export function boostCoursePoints(courseId, pointsToAdd) {
  if (!courseId) return { clicks: 0, boostedPoints: 0, totalRanking: 0 };
  const add = parseInt(pointsToAdd, 10) || 0;
  try {
    const currentBoost = getCourseBoostedPoints(courseId);
    const newBoost = Math.max(0, currentBoost + add);
    localStorage.setItem(`${BOOST_PREFIX}${courseId}`, newBoost.toString());

    const clicks = getCourseClicks(courseId);
    const totalRanking = clicks + newBoost;

    // Dispatch global event for live UI reactivity
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(RANKING_UPDATE_EVENT, {
        detail: {
          courseId,
          clicks,
          boostedPoints: newBoost,
          totalRanking,
          added: add,
          type: 'BOOST'
        }
      }));
    }

    return {
      clicks,
      boostedPoints: newBoost,
      totalRanking
    };
  } catch (e) {
    console.error('Error boosting course points:', e);
    return { clicks: 0, boostedPoints: 0, totalRanking: 0 };
  }
}

/**
 * Set exact boosted points for a course
 * @param {number|string} courseId 
 * @param {number} totalPoints 
 */
export function setCourseBoostedPoints(courseId, totalPoints) {
  if (!courseId) return;
  const points = Math.max(0, parseInt(totalPoints, 10) || 0);
  try {
    localStorage.setItem(`${BOOST_PREFIX}${courseId}`, points.toString());
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(RANKING_UPDATE_EVENT, {
        detail: {
          courseId,
          clicks: getCourseClicks(courseId),
          boostedPoints: points,
          type: 'SET_BOOST'
        }
      }));
    }
  } catch (e) {
    console.error('Error setting boosted points:', e);
  }
}

/**
 * Reset all stats (clicks and boosted points) for a course
 * @param {number|string} courseId 
 */
export function resetCourseStats(courseId) {
  if (!courseId) return;
  try {
    localStorage.removeItem(`${CLICKS_PREFIX}${courseId}`);
    localStorage.removeItem(`${BOOST_PREFIX}${courseId}`);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(RANKING_UPDATE_EVENT, {
        detail: {
          courseId,
          clicks: 0,
          boostedPoints: 0,
          totalRanking: 0,
          type: 'RESET'
        }
      }));
    }
  } catch (e) {
    console.error('Error resetting course stats:', e);
  }
}
