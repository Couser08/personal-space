export interface GoalMilestone {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  category: string;
  progressPercentage: number;
  targetDate?: string;
  milestones: GoalMilestone[];
  isCompleted: boolean;
  createdAt: string;
}
