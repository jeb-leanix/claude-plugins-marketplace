export class EpicAnalyzer {
    analyze(epic, subTasks) {
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
    groupByStatus(tasks) {
        const grouped = new Map();
        for (const task of tasks) {
            const status = task.fields.status.name;
            if (!grouped.has(status)) {
                grouped.set(status, []);
            }
            grouped.get(status).push(task);
        }
        return grouped;
    }
    countByStatus(tasks, statusName) {
        return tasks.filter((t) => t.fields.status.name === statusName).length;
    }
    identifyBlockers(tasks) {
        return tasks
            .filter((t) => t.fields.status.name === "Blocked")
            .map((task) => ({
            task,
            reason: this.extractBlockerReason(task),
        }));
    }
    extractBlockerReason(task) {
        // Try to extract blocker reason from description
        const desc = task.fields.description || "";
        const blockerMatch = desc.match(/blocked?:?\s*(.+)/i);
        return blockerMatch ? blockerMatch[1].trim() : undefined;
    }
    identifyNextSteps(analysis) {
        const steps = [];
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
        }
        else if (analysis.progress >= 50 && analysis.progress < 90) {
            steps.push("💪 Keep momentum - over halfway done!");
        }
        else if (analysis.progress >= 90) {
            steps.push("🏁 Final push - almost there!");
        }
        return steps;
    }
}
