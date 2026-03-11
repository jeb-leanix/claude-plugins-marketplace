/**
 * Slack API integration for posting messages
 */
export class SlackPoster {
    /**
     * Post a message to Slack using the Web API
     */
    async post(options) {
        const { token, channel, text, threadTs } = options;
        try {
            const body = {
                channel,
                text,
                mrkdwn: true,
            };
            if (threadTs) {
                body.thread_ts = threadTs;
            }
            const response = await fetch("https://slack.com/api/chat.postMessage", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });
            const data = await response.json();
            if (!data.ok) {
                return {
                    success: false,
                    error: data.error || "Unknown Slack API error",
                };
            }
            return {
                success: true,
                ts: data.ts,
                channel: data.channel,
            };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : String(error),
            };
        }
    }
    /**
     * Get list of channels
     */
    async listChannels(token) {
        try {
            const response = await fetch("https://slack.com/api/conversations.list", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (!data.ok) {
                throw new Error(data.error || "Failed to list channels");
            }
            return data.channels.map((ch) => ({
                id: ch.id,
                name: ch.name,
            }));
        }
        catch (error) {
            throw new Error(`Failed to list channels: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}
