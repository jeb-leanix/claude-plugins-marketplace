/**
 * Notification system - Desktop and Terminal notifications
 */
import { PREvent } from "./types.js";
export interface NotificationOptions {
    desktop: boolean;
    terminal: boolean;
}
export declare class Notifier {
    private options;
    constructor(options: NotificationOptions);
    /**
     * Send notification for an event
     */
    notify(event: PREvent, prNumber: number): void;
    /**
     * Send macOS desktop notification
     */
    private sendDesktopNotification;
    /**
     * Send terminal bell/beep
     */
    private sendTerminalBell;
    /**
     * Get system sound based on severity
     */
    private getSoundForSeverity;
    /**
     * Escape string for AppleScript
     */
    private escapeForAppleScript;
    /**
     * Send summary notification
     */
    notifySummary(summary: string, prNumber: number): void;
    /**
     * Send error notification (always sends, regardless of options)
     * This is for critical errors that need user attention
     */
    notifyError(title: string, message: string, prNumber: number): void;
}
