/**
 * Slack API integration for posting messages
 */
export interface SlackPostOptions {
    token: string;
    channel: string;
    text: string;
    threadTs?: string;
}
export interface SlackPostResult {
    success: boolean;
    ts?: string;
    channel?: string;
    error?: string;
}
export declare class SlackPoster {
    /**
     * Post a message to Slack using the Web API
     */
    post(options: SlackPostOptions): Promise<SlackPostResult>;
    /**
     * Get list of channels
     */
    listChannels(token: string): Promise<Array<{
        id: string;
        name: string;
    }>>;
}
