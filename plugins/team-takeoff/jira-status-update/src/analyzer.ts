import { JiraIssue, EpicAnalysis, BlockerInfo } from "./types.js";

export class EpicAnalyzer {
  analyze(epic: JiraIssue, subTasks: JiraIssue[]): EpicAnalysis {
    const tasksByStatus = this.groupByStatus(subTasks);

    const done = this.countByStatus(subTasks, "Done");
    const inProgress = this.countByStatus(subTasks, "In Progress");
    const blocked = this.countByStatus(subTasks, "Blocked");
    const toDo = subTasks.length - done - inProgress - blocked;

    const progress = subTasks.length > 0 ? Math.round((done / subTasks.length) * 100) : 0;

    const blockers = this.identifyBlockers(subTasks);

    return {
      total: subTasks.length,
      done,
      inProgress,
      blocked,
      toDo,
      progress,
      blockers,
      tasksByStatus,
    };
  }

  private groupByStatus(tasks: JiraIssue[]): Map<string, JiraIssue[]> {
    const grouped = new Map<string, JiraIssue[]>();

    for (const task of tasks) {
      const status = task.fields.status.name;
      if (!grouped.has(status)) {
        grouped.set(status, []);
      }
      grouped.get(status)!.push(task);
    }

    return grouped;
  }

  private countByStatus(tasks: JiraIssue[], statusName: string): number {
    return tasks.filter((t) => t.fields.status.name === statusName).length;
  }

  private identifyBlockers(tasks: JiraIssue[]): BlockerInfo[] {
    return tasks
      .filter((t) => t.fields.status.name === "Blocked")
      .map((task) => ({
        task,
        reason: this.extractBlockerReason(task),
      }));
  }

  private extractBlockerReason(task: JiraIssue): string | undefined {
    // Try to extract blocker reason from description
    const desc = task.fields.description || "";
    const blockerMatch = desc.match(/blocked?:?\s*(.+)/i);
    return blockerMatch ? blockerMatch[1].trim() : undefined;
  }

  identifyNextSteps(analysis: EpicAnalysis): string[] {
    const steps: string[] = [];

    // Prioritize blockers
    if (analysis.blockers.length > 0) {
      steps.push(`🔥 Unblock ${analysis.blockers.length} blocked task${analysis.blockers.length > 1 ? "s" : ""}`);
    }

    // Review ready tasks
    const inReview = Array.from(analysis.tasksByStatus.entries())
      .filter(([status]) => status.toLowerCase().includes("review"))
      .reduce((sum, [, tasks]) => sum + tasks.length, 0);

    if (inReview > 0) {
      steps.push(`👀 Review ${inReview} PR${inReview > 1 ? "s" : ""}`);
    }

    // Progress indicators
    if (analysis.progress < 50) {
      steps.push("🚀 Focus on completing in-progress tasks");
    } else if (analysis.progress >= 50 && analysis.progress < 90) {
      steps.push("💪 Keep momentum - over halfway done!");
    } else if (analysis.progress >= 90) {
      steps.push("🏁 Final push - almost there!");
    }

    return steps;
  }
}
