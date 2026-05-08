import { supabase } from "@/integrations/supabase/client";

/**
 * Grants an achievement to a user if they don't already have it.
 * Returns true if the achievement was newly granted.
 */
export const grantAchievement = async (userId: string, achievementId: string): Promise<boolean> => {
  try {
    // We use upsert with ON CONFLICT to avoid duplicate errors, 
    // but we can also just try to insert.
    const { error } = await supabase
      .from('user_achievements')
      .insert({ user_id: userId, achievement_id: achievementId });
    
    if (error) {
      // 23505 is unique violation (already earned)
      if (error.code === '23505') return false;
      console.error("Error granting achievement:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Achievement error:", err);
    return false;
  }
};

interface ExamResults {
  total_examenes: number;
  porcentaje: number;
  area_scores?: Record<string, number>;
  meta_success?: boolean;
}

/**
 * Checks and grants achievements based on exam results and historical stats.
 */
export const checkExamAchievements = async (userId: string, stats: ExamResults) => {
  const newlyGranted: string[] = [];

  // Achievement: First Exam
  if (stats.total_examenes >= 1) {
    if (await grantAchievement(userId, 'first_exam')) {
      newlyGranted.push('Primer Paso 🚀');
    }
  }

  // Achievement: Marathon (10 exams)
  if (stats.total_examenes >= 10) {
    if (await grantAchievement(userId, 'marathon_10')) {
      newlyGranted.push('Maratonista 🏃');
    }
  }

  // Achievement: Math Genius (>90% in Math)
  if (stats.area_scores && stats.area_scores['Matemáticas'] >= 90) {
    if (await grantAchievement(userId, 'score_90_math')) {
      newlyGranted.push('Genio Matemático 📐');
    }
  }

  // Achievement: Meta reached
  if (stats.meta_success) {
    if (await grantAchievement(userId, 'meta_reached')) {
      newlyGranted.push('Meta Alcanzada 🎯');
    }
  }

  return newlyGranted;
};
