export class MarkdownFormatter {
    format(epic, subTasks, analysis, detail) {
        let output = `# ${epic.key}: ${epic.fields.summary}\n\n`;
        // Metadata table
        output += `| Field | Value |\n`;
        output += `|-------|-------|\n`;
        output += `| Status | ${epic.fields.status.name} |\n`;
        output += `| Progress | ${analysis.progress}% (${analysis.done}/${analysis.total}) |\n`;
        if (epic.fields.assignee) {
            output += `| Owner | ${epic.fields.assignee.displayName} |\n`;
        }
        if (epic.fields.priority) {
            output += `| Priority | ${epic.fields.priority.name} |\n`;
        }
        output += `| Updated | ${new Date(epic.fields.updated).toLocaleDateString()} |\n\n`;
        // Progress bar
        const progressBar = this.createProgressBar(analysis.progress);
        output += `## Progress\n\n\`\`\`\n${progressBar}\n\`\`\`\n\n`;
        // Tasks by status
        output += `## Tasks by Status\n\n`;
        for (const [status, tasks] of analysis.tasksByStatus.entries()) {
            if (tasks.length === 0)
                continue;
            output += `### ${status} (${tasks.length})\n\n`;
            tasks.forEach((task) => {
                output += `- **[${task.key}](${process.env.JIRA_URL}/browse/${task.key})** ${task.fields.summary}`;
                if (task.fields.assignee) {
                    output += ` (${task.fields.assignee.displayName})`;
                }
                output += `\n`;
            });
            output += `\n`;
        }
        return output;
    }
    createProgressBar(percent, width = 50) {
        const filled = Math.round((percent / 100) * width);
        const empty = width - filled;
        return "█".repeat(filled) + "░".repeat(empty) + ` ${percent}%`;
    }
}
