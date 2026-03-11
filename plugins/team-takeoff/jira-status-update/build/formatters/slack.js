import { EpicAnalyzer } from "../analyzer.js";
export class SlackFormatter {
    analyzer;
    constructor() {
        this.analyzer = new EpicAnalyzer();
    }
    format(epic, subTasks, analysis, detail) {
        if (detail === "compact") {
            return this.formatCompact(epic, subTasks, analysis);
        }
        else if (detail === "detailed") {
            return this.formatDetailed(epic, subTasks, analysis);
        }
        else {
            return this.formatExecutive(epic, subTasks, analysis);
        }
    }
    formatCompact(epic, subTasks, analysis) {
        const statusEmoji = this.getStatusEmoji(epic.fields.status.name);
        const progressBar = this.createProgressBar(analysis.progress);
        let output = `# 📊 Status Update: ${epic.key} - ${epic.fields.summary}\n\n`;
        output += `**Status:** ${statusEmoji} ${epic.fields.status.name}`;
        if (epic.fields.assignee) {
            output += ` | **Owner:** ${epic.fields.assignee.displayName}`;
        }
        output += "\n\n";
        // Progress
        output += `## 🎯 Progress Overview\n\n`;
        output += `${progressBar} ${analysis.progress}%\n`;
        output += `✅ ${analysis.done}/${analysis.total} tasks complete\n\n`;
        // Tasks by status
        const inProgressTasks = Array.from(analysis.tasksByStatus.get("In Progress") || []);
        const inReviewTasks = Array.from(analysis.tasksByStatus.get("In Review") || []);
        const blockedTasks = Array.from(analysis.tasksByStatus.get("Blocked") || []);
        if (inReviewTasks.length > 0) {
            output += `## ✅ In Review (${inReviewTasks.length})\n`;
            inReviewTasks.forEach((t) => {
                output += this.formatTaskLine(t);
            });
            output += "\n";
        }
        if (inProgressTasks.length > 0) {
            output += `## 🚧 In Progress (${inProgressTasks.length})\n`;
            inProgressTasks.forEach((t) => {
                output += this.formatTaskLine(t);
            });
            output += "\n";
        }
        if (blockedTasks.length > 0) {
            output += `## 🔴 Blocked (${blockedTasks.length})\n`;
            blockedTasks.forEach((t) => {
                output += this.formatTaskLine(t);
                const blocker = analysis.blockers.find((b) => b.task.key === t.key);
                if (blocker?.reason) {
                    output += `⚠️ ${blocker.reason}\n`;
                }
            });
            output += "\n";
        }
        // Next steps
        const nextSteps = this.analyzer.identifyNextSteps(analysis);
        if (nextSteps.length > 0) {
            output += `## 📈 Next Steps\n\n`;
            nextSteps.forEach((step, i) => {
                output += `${i + 1}. ${step}\n`;
            });
            output += "\n";
        }
        // Summary
        output += `---\n\n`;
        output += `**ETA:** `;
        if (analysis.progress >= 90) {
            output += `Almost done! ${analysis.total - analysis.done} task${analysis.total - analysis.done !== 1 ? "s" : ""} remaining`;
        }
        else if (analysis.blocked > 0) {
            output += `Blockers need attention before progress can continue`;
        }
        else {
            output += `${analysis.inProgress} task${analysis.inProgress !== 1 ? "s" : ""} in progress`;
        }
        return output;
    }
    formatDetailed(epic, subTasks, analysis) {
        let output = this.formatCompact(epic, subTasks, analysis);
        output += `\n\n## 📋 All Tasks\n\n`;
        // Group by status and show all
        for (const [status, tasks] of analysis.tasksByStatus.entries()) {
            if (tasks.length === 0)
                continue;
            const statusEmoji = this.getStatusEmoji(status);
            output += `### ${statusEmoji} ${status} (${tasks.length})\n\n`;
            tasks.forEach((task) => {
                output += `**${task.key}** - ${task.fields.summary}\n`;
                if (task.fields.assignee) {
                    output += `👤 ${task.fields.assignee.displayName}`;
                }
                if (task.fields.priority) {
                    output += ` | 🎯 ${task.fields.priority.name}`;
                }
                output += `\n\n`;
            });
        }
        return output;
    }
    formatExecutive(epic, subTasks, analysis) {
        const statusEmoji = this.getStatusEmoji(epic.fields.status.name);
        const progressBar = this.createProgressBar(analysis.progress);
        let output = `# 📊 ${epic.key}: ${epic.fields.summary}\n\n`;
        output += `${progressBar} **${analysis.progress}%** complete\n\n`;
        // High-level summary
        output += `**Status:** ${statusEmoji} ${epic.fields.status.name}\n`;
        output += `**Progress:** ${analysis.done} of ${analysis.total} tasks completed\n`;
        if (analysis.blocked > 0) {
            output += `**🔴 Blockers:** ${analysis.blocked} tasks blocked\n`;
        }
        if (analysis.inProgress > 0) {
            output += `**🚧 Active Work:** ${analysis.inProgress} tasks in progress\n`;
        }
        output += `\n## 🎯 Key Insights\n\n`;
        // Insights
        if (analysis.progress >= 80) {
            output += `✅ **Nearly Complete** - Epic is ${analysis.progress}% done with ${analysis.total - analysis.done} remaining tasks\n`;
        }
        else if (analysis.progress >= 50) {
            output += `💪 **Good Progress** - Over halfway done, maintain momentum\n`;
        }
        else {
            output += `🚀 **Early Stage** - ${analysis.progress}% complete, ${analysis.inProgress} tasks actively being worked\n`;
        }
        if (analysis.blockers.length > 0) {
            output += `⚠️ **Attention Needed** - ${analysis.blockers.length} blocked task${analysis.blockers.length > 1 ? "s" : ""} requiring resolution\n`;
        }
        return output;
    }
    formatTaskLine(task) {
        let line = `**${task.key}** - ${task.fields.summary}\n`;
        if (task.fields.assignee) {
            line += `${this.getStatusEmoji(task.fields.status.name)} ${task.fields.assignee.displayName}`;
        }
        if (task.fields.priority) {
            line += ` | Priority: ${task.fields.priority.name}`;
        }
        line += "\n\n";
        return line;
    }
    createProgressBar(percent) {
        const filled = Math.round(percent / 10);
        const empty = 10 - filled;
        return "█".repeat(filled) + "░".repeat(empty);
    }
    getStatusEmoji(status) {
        const lower = status.toLowerCase();
        if (lower.includes("done") || lower.includes("complete"))
            return "✅";
        if (lower.includes("progress"))
            return "🟡";
        if (lower.includes("review"))
            return "👀";
        if (lower.includes("blocked"))
            return "🔴";
        if (lower.includes("todo") || lower.includes("to do"))
            return "⚪";
        return "🔵";
    }
}
